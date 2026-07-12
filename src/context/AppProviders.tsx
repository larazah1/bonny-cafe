"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { ToastProvider } from "./ToastContext";
import { AdminDataProvider } from "./AdminDataContext";
import { BranchProvider } from "./BranchContext";
import { CartProvider } from "./CartContext";
import { CustomerAuthProvider } from "./CustomerAuthContext";
import { StaffAuthProvider } from "./StaffAuthContext";
import { AdminAuthProvider } from "./AdminAuthContext";
import { OrdersProvider } from "./OrdersContext";
import { RentalProvider } from "./RentalContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ToastProvider>
        <AdminDataProvider>
          <BranchProvider>
            <CustomerAuthProvider>
              <StaffAuthProvider>
                <AdminAuthProvider>
                  <OrdersProvider>
                    <RentalProvider>
                      <CartProvider>{children}</CartProvider>
                    </RentalProvider>
                  </OrdersProvider>
                </AdminAuthProvider>
              </StaffAuthProvider>
            </CustomerAuthProvider>
          </BranchProvider>
        </AdminDataProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}
