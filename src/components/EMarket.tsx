import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Truck,
  ArrowRight,
  ShoppingCart,
  Send
} from 'lucide-react';
import {
  EMarketProduct,
  EMarketOrder,
  RFQ,
  User,
  DeliveryConsignment
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface EMarketProps {
  currentUser: User;
  products: EMarketProduct[];
  orders: EMarketOrder[];
  rfqs: RFQ[];
  consignments?: DeliveryConsignment[];
  onCreateOrder: (orderData: Partial<EMarketOrder>) => Promise<any>;
  onSubmitRFQ: (rfqData: Partial<RFQ>) => Promise<any>;
  onAcceptQuote?: (rfqId: string, sellerId?: string) => Promise<any>;
  onSubmitQuote?: (rfqId: string, quoteData: any) => Promise<any>;
}

export const EMarket: React.FC<EMarketProps> = ({
  currentUser,
  products,
  orders,
  rfqs,
  consignments = [],
  onCreateOrder,
  onSubmitRFQ,
  onAcceptQuote,
  onSubmitQuote
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'rfqs'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<{ product: EMarketProduct; quantity: number }[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // RFQ modal state
  const [showRfqModal, setShowRfqModal] = useState<EMarketProduct | null>(null);
  const [rfqQty, setRfqQty] = useState(2);
  const [rfqTargetPrice, setRfqTargetPrice] = useState(50000);
  const [rfqRequirements, setRfqRequirements] = useState('');
  const [rfqSuccess, setRfqSuccess] = useState(false);

  const categories = ['ALL', 'Fuel Dispensers', 'Submersible Pumps', 'Automation & ATG', 'Piping & Underground', 'Valves & Nozzles'];

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addToCart = (product: EMarketProduct) => {
    const existing = cart.find(c => c.product.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(c => c.product.id !== productId));
  };

  const totalCartAmount = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    await onCreateOrder({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.title,
        quantity: c.quantity,
        unitPrice: c.product.price,
        total: c.product.price * c.quantity
      })),
      totalAmount: totalCartAmount,
      shippingAddress: 'Highway Star Petro Hub, Forecourt Stores, Bulandshahr, UP'
    });
    setCart([]);
    setShowCartModal(false);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setActiveTab('orders');
    }, 2000);
  };

  const handleSendRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRfqModal) return;
    await onSubmitRFQ({
      productId: showRfqModal.id,
      productName: showRfqModal.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      requestedQty: Number(rfqQty),
      targetPrice: Number(rfqTargetPrice),
      requirements: rfqRequirements || 'Requires PESO certification and manufacturer testing certificate'
    });
    setShowRfqModal(null);
    setRfqSuccess(true);
    setTimeout(() => {
      setRfqSuccess(false);
      setActiveTab('rfqs');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* E-Market Top Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BPWLogo variant="light-bg" size="lg" subBrand="emarket" />
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#0F2B48]">Petroleum Equipment & Spares Marketplace</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                  OEM CERTIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct procurement of Dispensers, STPs, ATG Consoles & PESO-Certified Spares
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCartModal(true)}
              className="relative px-4 py-2.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-[#F59E0B]" />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="bg-[#E55812] text-white font-extrabold px-1.5 py-0.5 rounded-full text-[10px]">
                  ₹{totalCartAmount?.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notification Alerts */}
        {orderSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center shadow-sm">
            ✓ Wholesale purchase order created successfully. Dispatched from BPW Central Depot!
          </div>
        )}
        {rfqSuccess && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold text-center shadow-sm">
            ✓ Request for Quote (RFQ) broadcasted to verified OEM manufacturers.
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'catalog' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'rfqs' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            Bulk RFQs ({rfqs.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            My Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search dispensers, pumps, valves..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-purple-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                        {p.brand}
                      </span>
                      <span className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-sm text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                        {p.stockCount} Available
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="text-[11px] text-purple-400 font-semibold uppercase tracking-wider">{p.category}</div>
                      <h3 className="text-base font-bold text-white leading-snug">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
                      
                      <div className="space-y-1 pt-2 border-t border-slate-800/80">
                        {p.specifications.slice(0, 2).map((spec, sidx) => (
                          <div key={sidx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-baseline justify-between pt-3 border-t border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-500">Unit Price</div>
                        <div className="text-xl font-extrabold font-mono text-emerald-400">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">MOQ: {p.moq} Unit</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowRfqModal(p)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        Request Quote (RFQ)
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BULK RFQs */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Request for Quotes (RFQ) Engine</h2>
                <p className="text-xs text-slate-400">Direct bulk price negotiation with petroleum equipment OEMs</p>
              </div>
            </div>

            <div className="space-y-4">
              {rfqs.map(rfq => (
                <div key={rfq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          {rfq.rfqNumber}
                        </span>
                        <h3 className="text-base font-bold text-white">{rfq.productName}</h3>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Requested by: <strong className="text-slate-200">{rfq.buyerName}</strong> • Target Qty: <span className="font-bold text-white">{rfq.requestedQty}</span> units
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {rfq.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 font-semibold">Technical Specifications: </span>
                    {rfq.requirements}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                    <span>Target Budget: <strong className="text-emerald-400 font-mono text-sm">₹{rfq.targetPrice?.toLocaleString('en-IN')}</strong></span>
                    <span className="text-purple-400 font-semibold">{rfq.quotesReceived?.length || 0} Manufacturer Bids Received</span>
                  </div>

                  {/* Quotes Received Comparator Matrix */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Manufacturer Quotes & Bids:
                    </div>

                    {rfq.quotesReceived && rfq.quotesReceived.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rfq.quotesReceived.map((q, qidx) => (
                          <div key={qidx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{q.sellerName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                ₹{q.unitPrice?.toLocaleString('en-IN')} / unit
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 space-y-0.5">
                              <div>Delivery Lead Time: <strong className="text-slate-300">{q.deliveryTimeline}</strong></div>
                              <div>OEM Warranty: <strong className="text-slate-300">{q.warrantyPeriod}</strong></div>
                              {q.notes && <div className="italic text-slate-500">"{q.notes}"</div>}
                            </div>

                            {rfq.status !== 'ORDER_PLACED' && onAcceptQuote && (
                              <button
                                onClick={async () => {
                                  await onAcceptQuote(rfq.id, q.sellerId);
                                  setActiveTab('orders');
                                }}
                                className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept Quote & Issue Purchase Order</span>
                              </button>
                            )}

                            {rfq.status === 'ORDER_PLACED' && (
                              <div className="mt-2 text-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">
                                ✓ PO Issued & Dispatched
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                        OEMs are currently reviewing your technical specifications. You will receive quotes shortly.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {(orders || []).map(ord => {
              const matchedConsignment = (consignments || []).find(c => c.orderNumber === ord.orderNumber);
              return (
                <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">• Placed on {ord.createdAt.split('T')[0]}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        Deliver to: {ord.shippingAddress}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start">
                      {ord.status}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800 text-xs text-slate-300">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span>{item.productName} × {item.quantity}</span>
                        <span className="font-mono text-emerald-400 font-bold">₹{item.total?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Forecourt Logistics & Fleet Delivery Tracking Card */}
                  {matchedConsignment ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white">Forecourt Fleet Dispatch Telemetry</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          matchedConsignment.status === 'DELIVERED_POD'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {matchedConsignment.status?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <strong>Consignment No:</strong> <span className="font-mono text-white">{matchedConsignment.consignmentNumber}</span>
                        </div>
                        <div>
                          <strong>E-Way Bill:</strong> <span className="font-mono text-white">{matchedConsignment.ewayBillNumber}</span>
                        </div>
                        <div>
                          <strong>Driver / Rig:</strong> <span className="text-white">{matchedConsignment.driverName}</span> ({matchedConsignment.vehicleNumber})
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Current City: <strong className="text-amber-400">{matchedConsignment.currentCity}</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          ETA: {matchedConsignment.eta}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Logistics Consignment: Staging at Regional Depot</span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-400">Dispatch Pending</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">
                      Payment Status: <span className="text-emerald-400 font-bold">{ord.paymentStatus}</span>
                    </span>
                    <div className="text-base font-extrabold font-mono text-white">
                      Total: ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL: CART & CHECKOUT */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                Procurement Cart
              </h3>
              <button onClick={() => setShowCartModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Your cart is empty.</div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="divide-y divide-slate-800 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{item.product.title}</div>
                        <div className="text-slate-400">Qty: {item.quantity} × ₹{item.product.price?.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{(item.product.price * item.quantity)?.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-semibold">Total Payable</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    ₹{totalCartAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  Place B2B Purchase Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT RFQ */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                Request for Quote (RFQ)
              </h3>
              <button onClick={() => setShowRfqModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendRFQ} className="space-y-3.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl">
                <div className="font-bold text-white">{showRfqModal.title}</div>
                <div className="text-slate-400">{showRfqModal.brand} • Standard Rate: ₹{showRfqModal.price}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Required Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={rfqQty}
                    onChange={e => setRfqQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Price (Per Unit)</label>
                  <input
                    type="number"
                    value={rfqTargetPrice}
                    onChange={e => setRfqTargetPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Custom Requirements / Project Timeline</label>
                <textarea
                  rows={3}
                  placeholder="State delivery timeline, certification needs (PESO/OISD), or special coatings..."
                  value={rfqRequirements}
                  onChange={e => setRfqRequirements(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                >
                  Broadcast RFQ to Sellers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
