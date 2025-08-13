export enum ErrorMessages {
  ServerError = "SERVER_ERROR",
  ValidationError = "VALIDATION_ERROR",
  NotFoundError = "NOT_FOUND_ERROR",
  ConflictError = "CONFLICT_ERROR",
  UnauthorizedError = "UNAUTHORIZED_ERROR",
  ForbiddenError = "FORBIDDEN_ERROR",
  BadRequestError = "BAD_REQUEST_ERROR",
  UnprocessableEntityError = "UNPROCESSABLE_ENTITY_ERROR",

  EmailOrPhoneAlreadyExists = "EMAIL_OR_PHONE_ALREADY_EXISTS",
  UserNotFound = "USER_NOT_FOUND",
  InvalidPassword = "INVALID_PASSWORD",
  EmailAlreadyExists = "EMAIL_ALREADY_EXISTS",
  PhoneAlreadyExists = "PHONE_ALREADY_EXISTS",

  UserNotFoundWhileCreatingShop = "USER_NOT_FOUND_WHILE_CREATING_SHOP",
  PlanNotFoundWhileCreatingShop = "PLAN_NOT_FOUND_WHILE_CREATING_SHOP",
  CurrencyNotFoundWhileCreatingShop = "CURRENCY_NOT_FOUND_WHILE_CREATING_SHOP",
  PlanNotFoundOrDeleted = "PLAN_NOT_FOUND_OR_DELETED",
  CurrencyNotFoundOrDeleted = "CURRENCY_NOT_FOUND_OR_DELETED",

  ShopNotFound = "SHOP_NOT_FOUND",
  YouAreNotAuthorizedToUpdateThisShop = "YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_SHOP",

  InvalidTokenFormat = "INVALID_TOKEN_FORMAT",
  InvalidToken = "INVALID_TOKEN",
  FailedToChangeMenuTextAndUrl = "FAILED_TO_CHANGE_MENU_TEXT_AND_URL",
  FailedToGetMenuTextAndUrl = "FAILED_TO_GET_MENU_TEXT_AND_URL",
  TokenExpired = "TOKEN_EXPIRED",

  CategoryLimitReached = "CATEGORY_LIMIT_REACHED",
  CategoryNotFound = "CATEGORY_NOT_FOUND",

  ProductNotFound = "PRODUCT_NOT_FOUND",
  DeliveryMethodNotFound = "DELIVERY_METHOD_NOT_FOUND",
  PaymentMethodNotFound = "PAYMENT_METHOD_NOT_FOUND",
  PaymentMethodTypeNotClick = "PAYMENT_METHOD_TYPE_NOT_CLICK",
  TelegramBotNotFound = "TELEGRAM_BOT_NOT_FOUND",
  OrderNotFound = "ORDER_NOT_FOUND",
  YouHaveReachedTheLimitOfProducts = "YOU_HAVE_REACHED_THE_LIMIT_OF_PRODUCTS",

  AddressNotFound = "ADDRESS_NOT_FOUND",
  YouAreNotAuthorizedToUpdateThisAddress = "YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_ADDRESS",

  BranchNotFound = "BRANCH_NOT_FOUND",
  PickupAddressNotFound = "PICKUP_ADDRESS_NOT_FOUND",
  ProductOutOfStock = "PRODUCT_OUT_OF_STOCK",
}

export const errorMessagesMap: Record<ErrorMessages, string> = {
  [ErrorMessages.ServerError]: "Server xatosi",
  [ErrorMessages.ValidationError]: "Tekshirish xatosi",
  [ErrorMessages.NotFoundError]: "Topilmadi xatosi",
  [ErrorMessages.ConflictError]: "Ziddiyat xatosi",
  [ErrorMessages.UnauthorizedError]: "Ruxsatsiz xato",
  [ErrorMessages.ForbiddenError]: "Taqiqlangan xato",
  [ErrorMessages.BadRequestError]: "Noto'g'ri so'rov xatosi",
  [ErrorMessages.UnprocessableEntityError]:
    "Qayta ishlab bo'lmaydigan obyekt xatosi",
  [ErrorMessages.EmailOrPhoneAlreadyExists]:
    "Email yoki telefon raqami allaqachon mavjud",
  [ErrorMessages.UserNotFound]: "Foydalanuvchi topilmadi",
  [ErrorMessages.InvalidPassword]: "Noto'g'ri parol",
  [ErrorMessages.EmailAlreadyExists]: "Email allaqachon mavjud",
  [ErrorMessages.PhoneAlreadyExists]: "Telefon raqami allaqachon mavjud",
  [ErrorMessages.UserNotFoundWhileCreatingShop]:
    "Do'kon yaratishda foydalanuvchi topilmadi",
  [ErrorMessages.PlanNotFoundWhileCreatingShop]:
    "Do'kon yaratishda reja topilmadi",
  [ErrorMessages.CurrencyNotFoundWhileCreatingShop]:
    "Do'kon yaratishda valyuta topilmadi",
  [ErrorMessages.PlanNotFoundOrDeleted]: "Reja topilmadi yoki o'chirilgan",
  [ErrorMessages.CurrencyNotFoundOrDeleted]:
    "Valyuta topilmadi yoki o'chirilgan",
  [ErrorMessages.ShopNotFound]: "Do'kon topilmadi",
  [ErrorMessages.YouAreNotAuthorizedToUpdateThisShop]:
    "Siz bu do'konni yangilash huquqiga ega emassiz",
  [ErrorMessages.InvalidTokenFormat]: "Noto'g'ri token formati",
  [ErrorMessages.InvalidToken]: "Noto'g'ri token",
  [ErrorMessages.FailedToChangeMenuTextAndUrl]:
    "Menyu matni va URL-ni o'zgartirib bo'lmadi",
  [ErrorMessages.FailedToGetMenuTextAndUrl]:
    "Menyu matni va URL-ni olishda xatolik",
  [ErrorMessages.TokenExpired]: "Token amal qilish muddati tugagan",
  [ErrorMessages.CategoryLimitReached]:
    "Limitingiz tugadi. Iltimos tarifni o'zgartiring",
  [ErrorMessages.CategoryNotFound]: "Kategoriya topilmadi",
  [ErrorMessages.ProductNotFound]: "Mahsulot topilmadi",
  [ErrorMessages.DeliveryMethodNotFound]: "Yetkazib berish usuli topilmadi",
  [ErrorMessages.PaymentMethodNotFound]: "To'lov usuli topilmadi",
  [ErrorMessages.PaymentMethodTypeNotClick]: "To'lov usuli topilmadi",
  [ErrorMessages.TelegramBotNotFound]: "Telegram bot topilmadi",
  [ErrorMessages.OrderNotFound]: "Buyurtma topilmadi",
  [ErrorMessages.YouHaveReachedTheLimitOfProducts]:
    "Mahsulotlar limitiga erishdingiz",
  [ErrorMessages.AddressNotFound]: "Manzil topilmadi",
  [ErrorMessages.YouAreNotAuthorizedToUpdateThisAddress]:
    "Siz bu manzilni yangilash huquqiga ega emassiz",
  [ErrorMessages.BranchNotFound]: "Filial topilmadi",
  [ErrorMessages.PickupAddressNotFound]: "Olib ketish manzili topilmadi",
  [ErrorMessages.ProductOutOfStock]: "Mahsulot mavjud emas",
};
