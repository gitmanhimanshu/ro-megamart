import { Routes, Route, Navigate } from 'react-router-dom'
import SellerLayout from './SellerLayout'
import SellerDashboardPage from './pages/SellerDashboardPage'
import SellerProductsPage from './pages/SellerProductsPage'
import SellerBulkUploadPage from './pages/SellerBulkUploadPage'
import SellerWholesalePage from './pages/SellerWholesalePage'
import SellerReviewsPage from './pages/SellerReviewsPage'
import SellerImagesPage from './pages/SellerImagesPage'
import SellerReportsPage from './pages/SellerReportsPage'
import SellerInventoryReportPage from './pages/SellerInventoryReportPage'
import SellerOrdersReportPage from './pages/SellerOrdersReportPage'
import SellerPaymentsReportPage from './pages/SellerPaymentsReportPage'
import SellerOrdersPage from './pages/SellerOrdersPage'
import SellerSettingsPage from './pages/SellerSettingsPage'
import SellerCommissionPage from './pages/SellerCommissionPage'
import SellerSupportPage from './pages/SellerSupportPage'

export default function SellerPanel({ user, onToast }) {
  return (
    <SellerLayout user={user}>
      <Routes>
        <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/products" element={<SellerProductsPage onToast={onToast} />} />
        <Route path="/seller/products/bulk-upload" element={<SellerBulkUploadPage onToast={onToast} />} />
        <Route path="/seller/products/wholesale" element={<SellerWholesalePage />} />
        <Route path="/seller/products/reviews" element={<SellerReviewsPage onToast={onToast} />} />
        <Route path="/seller/products/images" element={<SellerImagesPage onToast={onToast} />} />
        <Route path="/seller/reports" element={<SellerReportsPage />} />
        <Route path="/seller/reports/inventory" element={<SellerInventoryReportPage />} />
        <Route path="/seller/reports/orders" element={<SellerOrdersReportPage />} />
        <Route path="/seller/reports/payments" element={<SellerPaymentsReportPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage onToast={onToast} />} />
        <Route path="/seller/settings" element={<SellerSettingsPage user={user} onToast={onToast} />} />
        <Route path="/seller/commission" element={<SellerCommissionPage />} />
        <Route path="/seller/support" element={<SellerSupportPage onToast={onToast} />} />
        <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
      </Routes>
    </SellerLayout>
  )
}
