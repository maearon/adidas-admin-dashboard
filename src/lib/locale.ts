// src/lib/locale.ts
import headerNavbarEn from "@/locales/en_US/headerNavbar.json"
import headerNavbarVi from "@/locales/vi_VN/headerNavbar.json"
import headerNavbarJa from "@/locales/ja_JP/headerNavbar.json"
import heroEn from "@/locales/en_US/hero.json"
import heroVi from "@/locales/vi_VN/hero.json"
import heroJa from "@/locales/ja_JP/hero.json"
import secondHeroEn from "@/locales/en_US/secondHero.json"
import secondHeroVi from "@/locales/vi_VN/secondHero.json"
import secondHeroJa from "@/locales/ja_JP/secondHero.json"
import videoHeroEn from "@/locales/en_US/videoHero.json"
import videoHeroVi from "@/locales/vi_VN/videoHero.json"
import videoHeroJa from "@/locales/ja_JP/videoHero.json"
import navbarEn from "@/locales/en_US/navbar.json"
import navbarVi from "@/locales/vi_VN/navbar.json"
import navbarJa from "@/locales/ja_JP/navbar.json"
import commonEn from "@/locales/en_US/common.json"
import commonVi from "@/locales/vi_VN/common.json"
import commonJa from "@/locales/ja_JP/common.json"
import authEn from "@/locales/en_US/auth.json"
import authVi from "@/locales/vi_VN/auth.json"
import authJa from "@/locales/ja_JP/auth.json"
import navigationEn from "@/locales/en_US/navigation.json"
import navigationVi from "@/locales/vi_VN/navigation.json"
import navigationJa from "@/locales/ja_JP/navigation.json"
import topbarEn from "@/locales/en_US/topbar.json"
import topbarVi from "@/locales/vi_VN/topbar.json"
import topbarJa from "@/locales/ja_JP/topbar.json"
import locationEn from "@/locales/en_US/location.json"
import locationVi from "@/locales/vi_VN/location.json"
import locationJa from "@/locales/ja_JP/location.json"
import feedbackEn from "@/locales/en_US/feedback.json"
import feedbackVi from "@/locales/vi_VN/feedback.json"
import feedbackJa from "@/locales/ja_JP/feedback.json"
import accountEn from "@/locales/en_US/account.json"
import accountVi from "@/locales/vi_VN/account.json"
import accountJa from "@/locales/ja_JP/account.json"
import productEn from "@/locales/en_US/product.json"
import productVi from "@/locales/vi_VN/product.json"
import productJa from "@/locales/ja_JP/product.json"
import mobileEn from "@/locales/en_US/mobile.json"
import mobileVi from "@/locales/vi_VN/mobile.json"
import mobileJa from "@/locales/ja_JP/mobile.json"
import footerEn from "@/locales/en_US/footer.json"
import footerVi from "@/locales/vi_VN/footer.json"
import footerJa from "@/locales/ja_JP/footer.json"
import megaMenuEn from "@/locales/en_US/mega-menu.json"
import megaMenuVi from "@/locales/vi_VN/mega-menu.json"
import megaMenuJa from "@/locales/ja_JP/mega-menu.json"
import productEditEn from "@/locales/en_US/product-edit.json"
import productEditVi from "@/locales/vi_VN/product-edit.json"
import productEditJa from "@/locales/ja_JP/product-edit.json"
import productListEn from "@/locales/en_US/product-list.json"
import productListVi from "@/locales/vi_VN/product-list.json"
import productListJa from "@/locales/ja_JP/product-list.json"
import filterEn from "@/locales/en_US/filter.json"
import filterVi from "@/locales/vi_VN/filter.json"
import filterJa from "@/locales/ja_JP/filter.json"
import productDetailEn from "@/locales/en_US/product-detail.json"
import productDetailVi from "@/locales/vi_VN/product-detail.json"
import productDetailJa from "@/locales/ja_JP/product-detail.json"
import categoryPagesEn from "@/locales/en_US/category-pages.json"
import categoryPagesVi from "@/locales/vi_VN/category-pages.json"
import categoryPagesJa from "@/locales/ja_JP/category-pages.json"
import storesEn from "@/locales/en_US/stores.json"
import storesVi from "@/locales/vi_VN/stores.json"
import storesJa from "@/locales/ja_JP/stores.json"
import homeEn from "@/locales/en_US/home.json"
import homeVi from "@/locales/vi_VN/home.json"
import homeJa from "@/locales/ja_JP/home.json"
import pageFooterEn from "@/locales/en_US/page-footer.json"
import pageFooterVi from "@/locales/vi_VN/page-footer.json"
import pageFooterJa from "@/locales/ja_JP/page-footer.json"
import chatEn from "@/locales/en_US/chat.json"
import chatVi from "@/locales/vi_VN/chat.json"
import chatJa from "@/locales/ja_JP/chat.json"
import settingsEn from "@/locales/en_US/settings.json"
import settingsVi from "@/locales/vi_VN/settings.json"
import settingsJa from "@/locales/ja_JP/settings.json"
import adminEn from "@/locales/en_US/admin.json"
import adminVi from "@/locales/vi_VN/admin.json"
import adminJa from "@/locales/ja_JP/admin.json"

const enPack = {
    navbar: navbarEn,
    headerNavbar: headerNavbarEn,
    hero: heroEn,
    secondHero: secondHeroEn,
    videoHero: videoHeroEn,
    common: commonEn,
    auth: authEn,
    navigation: navigationEn,
    topbar: topbarEn,
    location: locationEn,
    feedback: feedbackEn,
    account: accountEn,
    product: productEn,
    mobile: mobileEn,
    footer: footerEn,
    megaMenu: megaMenuEn,
    productEdit: productEditEn,
    productList: productListEn,
    filter: filterEn,
    productDetail: productDetailEn,
    categoryPages: categoryPagesEn,
    stores: storesEn,
    home: homeEn,
    pageFooter: pageFooterEn,
    chat: chatEn,
    settings: settingsEn,
    admin: adminEn,
}

export const locales = {
  en_US: enPack,
  vi_VN: {
    navbar: navbarVi,
    headerNavbar: headerNavbarVi,
    hero: heroVi,
    secondHero: secondHeroVi,
    videoHero: videoHeroVi,
    common: commonVi,
    auth: authVi,
    navigation: navigationVi,
    topbar: topbarVi,
    location: locationVi,
    feedback: feedbackVi,
    account: accountVi,
    product: productVi,
    mobile: mobileVi,
    footer: footerVi,
    megaMenu: megaMenuVi,
    productEdit: productEditVi,
    productList: productListVi,
    filter: filterVi,
    productDetail: productDetailVi,
    categoryPages: categoryPagesVi,
    stores: storesVi,
    home: homeVi,
    pageFooter: pageFooterVi,
    chat: chatVi,
    settings: settingsVi,
    admin: adminVi,
  },
  ja_JP: {
    navbar: navbarJa,
    headerNavbar: headerNavbarJa,
    hero: heroJa,
    secondHero: secondHeroJa,
    videoHero: videoHeroJa,
    common: commonJa,
    auth: authJa,
    navigation: navigationJa,
    topbar: topbarJa,
    location: locationJa,
    feedback: feedbackJa,
    account: accountJa,
    product: productJa,
    mobile: mobileJa,
    footer: footerJa,
    megaMenu: megaMenuJa,
    productEdit: productEditJa,
    productList: productListJa,
    filter: filterJa,
    productDetail: productDetailJa,
    categoryPages: categoryPagesJa,
    stores: storesJa,
    home: homeJa,
    pageFooter: pageFooterJa,
    chat: chatJa,
    settings: settingsJa,
    admin: adminJa,
  },
} as const

export type Locale = keyof typeof locales
export type Namespace = keyof typeof locales[Locale]
export type TranslationKey<N extends Namespace> = keyof typeof locales[Locale][N]
