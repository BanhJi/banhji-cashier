/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/dashboard/'
module.exports = {
    revenue                               : url + 'dashboard-revenue/institute/' + instituteId + '/asOf',
    sale_funel                            : url + 'dashboard-salefunel/institute/' + instituteId + '/asOf',
    sale_analysis                         : url + 'dashboard-saleanalysis/institute/' + instituteId + '/asOf',
    sale_payment_graph                    : url + 'dashboard-salepayment-graph/institute/' + instituteId + '/asOf',
    sale_over_credit_limit                : url + 'dashboard-saleover-creditlimit/institute/' + instituteId + '/asOf',

    total_purchase                        : url + 'dashboard-purchase/institute/' + instituteId + '/asOf',
    vendor_purchasex_purchase_order_graph : url + 'dashboard-vendorxpense-graph/institute/' + instituteId + '/asOf',
    vendor_purchase_analysis              : url + 'dashboard-vendoranalysis/institute/' + instituteId + '/asOf',
    vendor_3way_matching                  : url + 'dashboard-vendormatching/institute/' + instituteId + '/asOf',
    vendor_over_credit_limit              : url + 'dashboard-vendorover-creditlimit/institute/' + instituteId + '/asOf',

    product_top5_inventory_balance        : url + 'dashboard-producttop5balance/institute/' + instituteId + '/asOf',
    product_top5_inventory_category       : url + 'dashboard-producttop5category/institute/' + instituteId + '/asOf',
    product_purchase                      : url + 'dashboard-productpurchase/institute/' + instituteId + '/asOf',
    product_sale                          : url + 'dashboard-productsale/institute/' + instituteId + '/asOf',
    product_balance_purchase_sale_graph   : url + 'dashboard-productgraph/institute/' + instituteId + '/asOf',

    service_top5_service_category         : url + 'dashboard-servicetop5category/institute/' + instituteId + '/asOf',
    service_purchase                      : url + 'dashboard-servicepurchase/institute/' + instituteId + '/asOf',
    service_sale                          : url + 'dashboard-servicesale/institute/' + instituteId + '/asOf',
    service_revenue_graph                 : url + 'dashboard-servicegraph/institute/' + instituteId + '/asOf',
    service_project_ratio                 : url + 'dashboard-serviceprojectratio/institute/' + instituteId + '/asOf',

    banking_graph_payment_option          : url + 'dashboard-bank-graph/institute/' + instituteId + '/asOf',
    sale_margin_analysis                  : url + 'sale-margin-analysis/institute/' + instituteId + '/list',
    sale_tax_detail                       : url + 'sale-tax/institute/' + instituteId + '/list',
}