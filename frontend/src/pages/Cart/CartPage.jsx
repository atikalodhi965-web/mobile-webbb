import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Page Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight">
          Online Shop Cart
        </h1>

        {/* Outer Light Blue Container matching reference picture */}
        <div className="bg-[#EBF3FF] rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-100/80 shadow-xs">
          
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-2xl p-10 text-center space-y-4 shadow-sm">
              <div className="text-5xl">🛍️</div>
              <h2 className="text-2xl font-bold text-[#1C0D2A]">Your Cart is Currently Empty</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Looks like you haven't added any refurbished devices to your cart yet.
              </p>
              <Link
                to="/collections/refurbished"
                className="inline-block bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer text-sm"
              >
                Browse Refurbished Devices
              </Link>
            </div>
          ) : (
            /* Product List & Cart Summary */
            <div className="space-y-6">
              
              {/* Product Cards Stack */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const phoneBg = item.color?.phoneBg || '#255273';
                  const itemTotalPrice = item.unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative transition-all duration-200"
                    >
                      {/* Left: Thumbnail & Name & Specifications */}
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        
                        {/* Device Graphic Thumbnail */}
                        <div
                          className="w-16 h-20 rounded-xl p-1 shrink-0 flex items-center justify-center border border-black/10 shadow-xs"
                          style={{ backgroundColor: phoneBg }}
                        >
                          <div className="w-10 h-16 bg-slate-900 rounded-lg flex flex-col justify-between p-1 items-center">
                            <div className="w-4 h-1 bg-white/40 rounded-full mt-0.5"></div>
                            <span className="text-[9px] text-white font-bold tracking-tighter select-none">
                              {item.name.split(' ')[0]}
                            </span>
                            <div className="w-4 h-0.5 bg-white/60 rounded-full mb-0.5"></div>
                          </div>
                        </div>

                        {/* Name & Specification */}
                        <div className="flex-grow sm:flex-grow-0 sm:w-64">
                          <h3 className="text-base sm:text-lg font-bold text-[#1C0D2A]">
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      {/* Specs Detail */}
                      <div className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto text-left sm:text-center">
                        {item.capacity} / {item.color?.name || 'Default'} / {item.condition?.condition || 'Fair+'}
                      </div>

                      {/* Quantity Stepper Input & Line Price */}
                      <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                        
                        {/* Interactive Quantity Input matching spinner design */}
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            className="w-16 sm:w-20 py-1.5 px-2 border border-gray-300 rounded-lg text-center font-bold text-sm text-[#1C0D2A] focus:outline-none focus:border-[#FF6534] bg-white shadow-2xs"
                          />
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-base sm:text-lg font-black text-[#FF6534]">
                            £{itemTotalPrice}
                          </span>
                        </div>

                        {/* Close / Remove '✖' Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-black font-extrabold text-xl p-1 cursor-pointer transition-colors leading-none"
                          title="Remove item"
                        >
                          ✖
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Payment Notice Section matching reference image */}
              <div className="pt-4 text-xs sm:text-sm text-gray-700 space-y-1">
                <h4 className="font-bold text-[#1C0D2A] text-sm sm:text-base">
                  Pay with PayPal or Klarna
                </h4>
                <p className="text-gray-600 font-medium">
                  You can split your payment in 3 with Klarna, or checkout using PayPal.
                </p>
                <p className="text-gray-600 font-medium">
                  If you don't have a PayPal account, don't worry. You can still go through PayPal as a guest, and checkout using a credit or debit card.
                </p>
              </div>

              {/* Subtotal & Checkout Button */}
              <div className="flex flex-col items-end pt-2 border-t border-blue-200/60">
                <div className="text-right text-base sm:text-lg font-bold text-[#1C0D2A]">
                  Subtotal : <span className="font-black text-[#FF6534] text-xl sm:text-2xl">£{cartSubtotal}</span>
                </div>

                <button
                  type="button"
                  id="cart-checkout-btn"
                  onClick={() => navigate('/checkout')}
                  className="mt-4 bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-base py-3.5 px-10 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Checkout Cart
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Repair Discount Notice */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-600 font-semibold border-t border-gray-100 pt-6">
          Any discounts for additional repairs will be added on the checkout stage
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
