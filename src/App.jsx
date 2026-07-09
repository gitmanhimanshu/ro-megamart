import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import Navbar from './components/Navbar'
import CategoryNav from './components/CategoryNav'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import CategorySection from './components/CategorySection'
import PromoStrip, { PromoBanner } from './components/PromoBanner'
import TopBrands from './components/TopBrands'
import StatsBand from './components/StatsBand'
import CtaBlocks from './components/CtaBlocks'
import { BlogSection, BlogView } from './components/Blog'
import Footer from './components/Footer'
import Toast from './components/Toast'
import TrustStrip from './components/TrustStrip'
import SuggestedSection from './components/SuggestedSection'
import RecentlyViewed from './components/RecentlyViewed'
import NewArrivals from './components/NewArrivals'
import SearchResults from './components/SearchResults'
import CategoryView from './components/CategoryView'
import ProductView from './components/ProductView'
import MobileNav from './components/MobileNav'
import SellerPanel from './components/seller/SellerPanel'
import ProfileView from './components/ProfileView'
import CheckoutView from './components/CheckoutView'
import OrdersView from './components/OrdersView'
import SellersView from './components/SellersView'
import SellerProfileView from './components/SellerProfileView'
import BrandsView from './components/BrandsView'
import BrandView from './components/BrandView'
import PromoDealsView from './components/PromoDealsView'
import ContactView from './components/ContactView'
import AdPopup from './components/AdPopup'
import AppBanner from './components/AppBanner'
import PhoneGatePopup from './components/PhoneGatePopup'
import PriceGatePopup from './components/PriceGatePopup'
import EnquiryModal from './components/EnquiryModal'
import AssistantWidget from './components/AssistantWidget'
import { ScrollProgress, BackToTop } from './components/ScrollHelpers'
import { SellerModal, TrackModal, CartModal, WishlistModal } from './components/Modals'
import { CATEGORIES, TAGLINE, PROMOS, PRODUCT_INDEX, SELLERS, BRANDS, NEW_PRODUCTS, getCategory } from './data'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)

export default function App() {
  const [wishlist, setWishlist] = useState(() => new Set())
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('rmg_user'); return s ? JSON.parse(s) : null }
    catch { return null }
  })
  const [modal, setModal] = useState(null)
  const [showPhoneGate, setShowPhoneGate] = useState(false)
  const [enquiryProduct, setEnquiryProduct] = useState(null)
  const [activeProduct, setActiveProduct] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  const [showBlog, setShowBlog] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [showSellers, setShowSellers] = useState(false)
  const [showBrands, setShowBrands] = useState(false)
  const [activeBrand, setActiveBrand] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [activePromo, setActivePromo] = useState(null)
  const [activeSeller, setActiveSeller] = useState(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [orders, setOrders] = useState(() => {
    try { const s = localStorage.getItem('rmg_orders'); return s ? JSON.parse(s) : [] }
    catch { return [] }
  })

  // Persist order history to localStorage
  useEffect(() => {
    localStorage.setItem('rmg_orders', JSON.stringify(orders))
  }, [orders])

  // Recently viewed — product keys only, newest first, capped at 10.
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { const s = localStorage.getItem('rmg_recent'); return s ? JSON.parse(s) : [] }
    catch { return [] }
  })
  useEffect(() => {
    localStorage.setItem('rmg_recent', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const navigate = useNavigate()
  const location = useLocation()
  // Seller dashboard shell — only the real /seller and /seller/* admin routes,
  // NOT the buyer-side "/sellers" directory (which also begins with "/seller").
  const isSeller = location.pathname === '/seller' || location.pathname.startsWith('/seller/')

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('rmg_user', JSON.stringify(user))
    else localStorage.removeItem('rmg_user')
  }, [user])

  // ---------------------------------------------------------------------------
  //  Real URL routing for every buyer-side view.
  //
  //  The URL is the single source of truth: navigation helpers call navigate()
  //  to change the path, and one sync effect reads location and flips the view
  //  flags below. So every page has its own shareable URL (e.g.
  //  /category/domestic-spares, /product/..., /store/<seller>, /brands,
  //  /deals/crazy-sale) and the browser Back/Forward buttons work natively via
  //  react-router. App is mounted on the "*" route, so we parse the pathname
  //  ourselves (no per-route <Route> needed) — this also sidesteps param
  //  encoding pitfalls for product keys / seller names.
  // ---------------------------------------------------------------------------
  const searchRef = useRef(search)
  searchRef.current = search

  // The animation key for <main> — remounts on each distinct view.
  const viewSig =
    showCheckout ? 'checkout' : showOrders ? 'orders' : showProfile ? 'profile'
      : showSellers ? 'sellers' : showBrands ? 'brands' : showContact ? 'contact'
      : showAllCategories ? 'all-categories'
      : activeBrand ? `brand-${activeBrand}`
      : activeSeller ? `seller-${activeSeller}`
      : activeProduct ? `product-${activeProduct.key}`
      : category ? `category-${category.id}`
      : activePromo ? `promo-${activePromo}`
      : showBlog ? 'blog' : (search.trim() ? 'search' : 'home')

  // URL → view state. Runs on every location change (clicks, Back, Forward,
  // direct loads / refresh).
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const head = parts[0] || ''
    const params = new URLSearchParams(location.search)

    const isCategory = head === 'category'
    const isProduct = head === 'product'
    const isStore = head === 'store'
    const isSearch = head === 'search'

    setCategory(isCategory && getCategory(parts[1]) ? { id: parts[1], subSlug: params.get('sub') || null } : null)
    setShowAllCategories(isCategory && !getCategory(parts[1]))
    const prodKey = isProduct ? decodeURIComponent(parts.slice(1).join('/')) : null
    setActiveProduct(prodKey ? (PRODUCT_INDEX[prodKey] || null) : null)
    const storeName = isStore ? decodeURIComponent(parts.slice(1).join('/')) : null
    setActiveSeller(storeName && SELLERS.some((s) => s.name === storeName) ? storeName : null)
    setShowSellers(head === 'sellers')
    setShowBrands(head === 'brands')
    setActiveBrand(head === 'brand' && parts[1] ? decodeURIComponent(parts[1].replace(/-/g, ' ')) : null)
    setShowBlog(head === 'blogs')
    setShowContact(head === 'contact')
    setActivePromo(head === 'deals' ? parts[1] : null)
    setShowOrders(head === 'orders')
    setShowCheckout(head === 'checkout')
    setShowProfile(head === 'profile')

    if (isSearch) {
      const q = params.get('q') || ''
      if (q !== searchRef.current) setSearch(q)
    } else {
      setSearch('')
    }

    // Track recently-viewed when a product page loads.
    if (prodKey && PRODUCT_INDEX[prodKey]) {
      setRecentlyViewed((prev) => [prodKey, ...prev.filter((k) => k !== prodKey)].slice(0, 10))
    }

    // Scroll to top on real page changes (but not while typing a search).
    if (!isSearch) window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  // Every in-app Back/Close button + the browser Back button share one path.
  const goBack = useCallback(() => navigate(-1), [navigate])

  const openCategory = useCallback((id, subSlug = null) => {
    navigate(subSlug ? `/category/${id}?sub=${encodeURIComponent(subSlug)}` : `/category/${id}`)
  }, [navigate])

  const openBlog = useCallback(() => navigate('/blogs'), [navigate])

  const onSearchChange = useCallback((v) => {
    setSearch(v) // keep the input responsive immediately
    if (v) navigate(`/search?q=${encodeURIComponent(v)}`, { replace: location.pathname === '/search' })
    else navigate('/')
  }, [navigate, location.pathname])

  const openOrders = useCallback(() => navigate('/orders'), [navigate])
  const openSellers = useCallback(() => navigate('/sellers'), [navigate])
  const openBrands = useCallback(() => navigate('/brands'), [navigate])
  const openContact = useCallback(() => navigate('/contact'), [navigate])

  // Open a single seller's real storefront page (their actual listed products).
  const openSellerProfile = useCallback((name) => {
    navigate(`/store/${encodeURIComponent(name)}`)
  }, [navigate])

  // From the Brands directory — jump to that brand name via the existing
  // search (it already matches against seller/brand name). Scroll to top since
  // this can be triggered from deep down a page (e.g. footer / brands list).
  const searchFor = useCallback((name) => {
    onSearchChange(name)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [onSearchChange])

  const closeModal = useCallback(() => setModal(null), [])
  const isWished = useCallback((key) => wishlist.has(key), [wishlist])

  const toggleWish = useCallback((key) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  // Returns true/false so callers (e.g. "move to cart" from wishlist) can
  // tell whether the add actually happened, instead of assuming success
  // when an unauthenticated buyer just got redirected to /login.
  const addToCart = useCallback((product, qty = 1) => {
    if (!user && !product.enquiryOnly) { setShowPhoneGate(true); return false }
    setCart((prev) => {
      const found = prev.find((i) => i.key === product.key)
      if (found) return prev.map((i) => (i.key === product.key ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { ...product, qty }]
    })
    setToast(`Added to cart: ${truncate(product.name)}`)
    return true
  }, [user])

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((i) => i.key !== key)), [])

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return removeFromCart(key)
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }, [removeFromCart])

  const buyNow = useCallback((product, qty = 1) => {
    // Enquiry-only products open a proper enquiry form (name/mobile/qty/message)
    // instead of going into the cart.
    if (product.enquiryOnly) { setEnquiryProduct(product); return }
    if (!user) { setShowPhoneGate(true); return }
    addToCart(product, qty)
    setModal('cart')
  }, [addToCart, user])

  // "Checkout" in the cart modal now opens the full Checkout flow (address →
  // payment → review) instead of instantly clearing the cart.
  const goToCheckout = useCallback(() => {
    setModal(null)
    navigate('/checkout')
  }, [navigate])

  // Called by CheckoutView once address + payment + review are confirmed.
  // Builds a real order record from the current cart, saves it to order
  // history, and clears the cart.
  const placeOrder = useCallback(({ address, payment }) => {
    const subtotal = cart.reduce((s, i) => s + (i.enquiryOnly ? 0 : i.price * i.qty), 0)
    const order = {
      id: `ROM${Date.now().toString().slice(-8)}`,
      items: cart,
      address,
      payment,
      subtotal,
      total: subtotal, // shipping is free for this demo
      status: 'Placed',
      date: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    setCart([])
    return order
  }, [cart])

  const logout = useCallback(() => {
    setUser(null)
    navigate('/')
    setToast('You have been logged out.')
  }, [navigate])

  const uploadKycCard = useCallback((image) => {
    setUser((u) => (u ? { ...u, kyc: { image, status: 'pending' } } : u))
    setToast('Visiting card uploaded — pending verification.')
  }, [])

  const simulateVerify = useCallback(() => {
    setUser((u) => (u ? { ...u, kyc: { ...u.kyc, status: 'verified' } } : u))
    setToast('KYC verified! (demo simulation)')
  }, [])

  const wishlistItems = useMemo(
    () => [...wishlist].map((key) => PRODUCT_INDEX[key]).filter(Boolean),
    [wishlist],
  )

  const query = search.trim().toLowerCase()
  const searching = query.length > 0
  const searchResults = useMemo(() => {
    if (!query) return []
    return ALL_PRODUCTS.filter((p) =>
      `${p.name} ${p.seller} ${p.catName}`.toLowerCase().includes(query),
    )
  }, [query])

  const suggestedProducts = useMemo(
    () => ALL_PRODUCTS.filter((p) => !p.enquiryOnly).slice(0, 4),
    [],
  )

  // Product details are public — guests can browse and open any product
  // page. Price / Buy Now / Add to Cart stay gated behind onRequireLogin
  // inside ProductView/ProductCard, same as the grid cards already do.
  const openProduct = useCallback((p) => {
    navigate(`/product/${encodeURIComponent(p.key)}`)
  }, [navigate])

  const removeRecentlyViewed = useCallback((key) => {
    setRecentlyViewed((prev) => prev.filter((k) => k !== key))
  }, [])

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), [])

  const recentlyViewedProducts = useMemo(
    () => recentlyViewed.map((k) => PRODUCT_INDEX[k]).filter(Boolean),
    [recentlyViewed],
  )

  const productHandlers = {
    isWished,
    onToggleWish: toggleWish,
    onView: openProduct,
    onBuyNow: buyNow,
    isLoggedIn: !!user,
    onRequireLogin: () => setShowPhoneGate(true),
  }

  const onNavigate = useCallback((target) => {
    if (target === 'track') { setModal('track'); return }
    if (target === 'blogs') { navigate('/blogs'); return }
    if (target === 'sellers-page') { navigate('/sellers'); return }
    if (target === 'all-brands') { navigate('/brands'); return }
    if (target === 'contact') { navigate('/contact'); return }
    if (target === 'categories-grid') { navigate('/category'); return }
    if (target === 'promos') { navigate('/deals/flash'); return }
    if (target === 'whats-new' || target === 'crazy-sale') { navigate(`/deals/${target}`); return }
    // Remaining targets are homepage section anchors — go home, then scroll.
    navigate('/')
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [navigate])

  // Seller dashboard — full-page admin shell
  if (isSeller) {
    if (!user || user.role !== 'seller') {
      return <Navigate to="/login" replace />
    }
    return (
      <>
        <SellerPanel user={user} onToast={setToast} />
        <Toast message={toast} onDone={() => setToast('')} />
      </>
    )
  }

  return (
    <div id="top" className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <AdPopup />
      <AppBanner />
      <ScrollProgress />
      <Navbar
        wishlistCount={wishlist.size}
        cartCount={cart.length}
        user={user}
        searchQuery={search}
        onSearchChange={onSearchChange}
        onPickProduct={(p) => openProduct(p)}
        onPickCategory={(id) => openCategory(id)}
        onLogin={() => navigate('/login', { state: { from: location.pathname + location.search } })}
        onLogout={logout}
        onOpenCart={() => setModal('cart')}
        onOpenWishlist={() => setModal('wishlist')}
        onOpenDashboard={() => navigate('/seller/dashboard')}
        onOpenProfile={() => navigate('/profile')}
        onOpenOrders={openOrders}
      />
      <CategoryNav onNavigate={onNavigate} />

      <main key={
        showCheckout ? 'checkout' : showOrders ? 'orders' : showProfile ? 'profile'
          : showSellers ? 'sellers' : showBrands ? 'brands' : showContact ? 'contact'
          : activeSeller ? `seller-${activeSeller}`
          : activeProduct ? `product-${activeProduct.key}`
          : category ? `category-${category.id}`
          : activePromo ? `promo-${activePromo}`
          : showBlog ? 'blog' : searching ? 'search' : 'home'
      } className="animate-fade-up">
        <Helmet>
          <title>Romegamart — India's #1 B2B Marketplace for RO Industry</title>
          <meta name="description" content="Buy &amp; sell wholesale RO spares, membranes, pumps, water purifiers &amp; industrial RO plants. Connect with 2000+ verified sellers across India." />
          <meta name="keywords" content="RO spares wholesale, RO membrane, RO pump, industrial RO plant, domestic RO system, water softener, B2B RO marketplace, RO dealers India" />
          <meta property="og:title" content="Romegamart — B2B RO Marketplace" />
          <meta property="og:description" content="India's largest B2B marketplace for the RO &amp; water-treatment industry." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://romegamart.com" />
          <meta property="og:image" content="https://romegamart.com/romegamart-logo.webp" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href="https://romegamart.com" />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Romegamart',
            url: 'https://romegamart.com/',
            logo: 'https://romegamart.com/romegamart-logo.webp',
            description: "India's 1st & largest B2B marketplace for the RO industry.",
            contactPoint: { '@type': 'ContactPoint', telephone: '+91-1800-889-8529', contactType: 'customer service', areaServed: 'IN' },
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Romegamart',
            url: 'https://romegamart.com/',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://romegamart.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          })}</script>
        </Helmet>
        {showCheckout && user ? (
          <CheckoutView
            cart={cart}
            user={user}
            onPlaceOrder={placeOrder}
            onExit={goBack}
            onViewOrders={openOrders}
            onToast={setToast}
          />
        ) : showOrders && user ? (
          <OrdersView orders={orders} onExit={goBack} onBrowse={() => openCategory(CATEGORIES[0]?.id)} />
        ) : showSellers ? (
          <SellersView sellers={SELLERS} onClose={goBack} onViewSeller={openSellerProfile} />
        ) : showBrands ? (
          <BrandsView onClose={goBack} onSearchBrand={searchFor} onOpenBrand={(name) => navigate(`/brand/${encodeURIComponent(name)}`)} />
        ) : showContact ? (
          <ContactView onClose={goBack} onOpenAssistant={() => setAssistantOpen(true)} />
        ) : showAllCategories ? (
          <>
            <Helmet>
              <title>All Categories — RO Parts, Spares & Water Treatment | Romegamart</title>
              <meta name="description" content="Browse all RO industry categories — domestic spares, industrial systems, water ATMs, bottling plants &amp; more. India's largest B2B water-treatment marketplace." />
              <meta property="og:title" content="All Categories — Romegamart B2B Marketplace" />
              <meta property="og:description" content="Explore 13+ RO industry categories with 10,000+ verified products at wholesale prices." />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://romegamart.com/category" />
              <link rel="canonical" href="https://romegamart.com/category" />
            </Helmet>
            <div className="mx-auto max-w-7xl px-4 py-6">
              <button onClick={goBack} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to home
              </button>
              <h1 className="mb-6 text-lg font-bold text-navy-800">All Categories</h1>
              <CategoryGrid onOpenCategory={openCategory} compact={false} />
            </div>
          </>
        ) : activeBrand ? (
          <BrandView
            brandName={activeBrand}
            onClose={goBack}
            isWished={isWished}
            onToggleWish={toggleWish}
            onView={openProduct}
            onBuyNow={buyNow}
            isLoggedIn={!!user}
            onRequireLogin={() => setShowPhoneGate(true)}
          />
        ) : activeSeller ? (
          <SellerProfileView
            seller={SELLERS.find((s) => s.name === activeSeller)}
            products={ALL_PRODUCTS.filter((p) => p.seller === activeSeller)}
            onClose={goBack}
            {...productHandlers}
          />
        ) : showProfile && user ? (
          <ProfileView
            user={user}
            onExit={goBack}
            onOpenDashboard={() => navigate('/seller/dashboard')}
            onOpenOrders={openOrders}
            onUploadKyc={uploadKycCard}
            onSimulateVerify={simulateVerify}
          />
        ) : activeProduct ? (
          <ProductView
            product={activeProduct}
            onClose={goBack}
            onAddToCart={(p, q) => addToCart(p, q)}
            onBuyNow={buyNow}
            wished={isWished(activeProduct.key)}
            onToggleWish={toggleWish}
            onView={openProduct}
            onViewStore={openSellerProfile}
            isWished={isWished}
            isLoggedIn={!!user}
            onRequireLogin={() => setShowPhoneGate(true)}
          />
        ) : category ? (
          <CategoryView
            category={getCategory(category.id)}
            subSlug={category.subSlug}
            onSelectSub={(subSlug) => navigate(subSlug ? `/category/${category.id}?sub=${encodeURIComponent(subSlug)}` : `/category/${category.id}`)}
            onClose={goBack}
            {...productHandlers}
          />
        ) : activePromo ? (
          <PromoDealsView
            kind={activePromo}
            onClose={goBack}
            {...productHandlers}
          />
        ) : showBlog ? (
          <BlogView onClose={goBack} onNavigate={onNavigate} />
        ) : searching ? (
          <SearchResults
            query={search.trim()}
            results={searchResults}
            onClear={goBack}
            {...productHandlers}
          />
        ) : (
          <>
            <Hero />
            <section className="mx-auto mt-4 max-w-7xl px-3 sm:px-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {PROMOS.slice(0, 3).map((p) => (
                  <PromoBanner key={p.title} {...p} onNavigate={onNavigate} />
                ))}
              </div>
            </section>
            <TrustStrip />
            <p className="mx-auto mt-6 max-w-4xl px-6 text-center text-sm font-medium text-slate-500 sm:text-base">
              {TAGLINE}
            </p>
            <NewArrivals
              products={NEW_PRODUCTS}
              onViewAll={() => onNavigate('whats-new')}
              {...productHandlers}
            />
            <RecentlyViewed
              products={recentlyViewedProducts}
              onRemove={removeRecentlyViewed}
              onClear={clearRecentlyViewed}
              {...productHandlers}
            />
            <SuggestedSection
              products={suggestedProducts}
              onBrowseAll={() => openCategory(CATEGORIES[0]?.id)}
              {...productHandlers}
            />
            <CategoryGrid onOpenCategory={openCategory} />
            {/* Alternating white/slate bands break up the long run of category
                blocks into visually distinct sections instead of one flat scroll. */}
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className={i % 2 === 1 ? 'border-y border-slate-100 bg-white' : ''}>
                <CategorySection category={cat} onOpenCategory={openCategory} {...productHandlers} />
                {i === 3 && <PromoStrip onNavigate={onNavigate} />}
                {i === 7 && <TopBrands />}
              </div>
            ))}
            <CtaBlocks onEnquire={() => setAssistantOpen(true)} />
            <BlogSection onViewAll={openBlog} />
            <StatsBand />
          </>
        )}
      </main>

      <Footer
        onSeller={() => setModal('seller')}
        onTrack={() => setModal('track')}
        onOpenCategory={openCategory}
        onBlogs={openBlog}
        onSellers={openSellers}
        onBrands={openBrands}
        onContact={openContact}
      />

      <AssistantWidget
        open={assistantOpen}
        setOpen={setAssistantOpen}
        onTrack={() => setModal('track')}
        onToast={setToast}
        onPickProduct={openProduct}
        onPickCategory={(id) => openCategory(id)}
        user={user}
        hasRecentlyViewed={recentlyViewedProducts.length > 0}
        onShowRecentlyViewed={() => onNavigate('recently-viewed')}
        onOpenWishlist={() => setModal('wishlist')}
        onOpenCart={() => setModal('cart')}
        onOpenOrders={openOrders}
        onRequireLogin={() => setShowPhoneGate(true)}
      />
      <BackToTop />
      <MobileNav
        wishlistCount={wishlist.size}
        cartCount={cart.length}
        onOpenCart={() => setModal('cart')}
        onOpenWishlist={() => setModal('wishlist')}
      />

      <SellerModal open={modal === 'seller'} onClose={closeModal} onDone={(m) => { closeModal(); setToast(m) }} />
      <TrackModal open={modal === 'track'} onClose={closeModal} />
      <CartModal open={modal === 'cart'} onClose={closeModal} cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onCheckout={goToCheckout} />
      <WishlistModal
        open={modal === 'wishlist'}
        onClose={closeModal}
        items={wishlistItems}
        isLoggedIn={!!user}
        onRemove={toggleWish}
        onMoveToCart={(item) => { if (addToCart(item, 1)) toggleWish(item.key) }}
      />

      <PhoneGatePopup open={showPhoneGate} onClose={() => setShowPhoneGate(false)} />
      <EnquiryModal open={!!enquiryProduct} product={enquiryProduct} onClose={() => setEnquiryProduct(null)} onToast={setToast} />
      {!user && <PriceGatePopup onLogin={() => navigate('/login')} />}

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}

const truncate = (s, n = 38) => (s.length > n ? `${s.slice(0, n)}…` : s)
