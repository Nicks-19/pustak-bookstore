from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from enum import Enum

class ConditionGrade(str, Enum):
    New = "New"
    Mint = "Mint"
    Good = "Good"
    Fair = "Fair"
    Poor = "Poor"
    Damaged = "Damaged"

class PaymentMode(str, Enum):
    Cash = "Cash"
    UPI = "UPI"
    Card = "Card"
    Wallet = "Wallet Credit"
    Split = "Split"

# ================= Book Schemas =================
class BookCreate(BaseModel):
    isbn: str = Field(..., min_length=10, max_length=17, description="ISBN-10 or ISBN-13")
    title: str = Field(..., min_length=2, max_length=200)
    author: str = Field(..., min_length=2, max_length=150)
    category: str = Field(default="Engineering", min_length=2, max_length=50)
    course_branch: str = Field(default="General", max_length=50)
    semester: int = Field(default=0, ge=0, le=8)
    publisher: str = Field(default="Standard", min_length=2, max_length=100)
    mrp: float = Field(..., gt=0, le=50000)
    selling_price: float = Field(..., gt=0, le=50000)
    stock_quantity: int = Field(default=1, ge=0, le=10000)
    is_preowned: bool = Field(default=False)
    condition_grade: ConditionGrade = Field(default=ConditionGrade.New)
    aisle_no: str = Field(default="Aisle 1", min_length=2, max_length=30)
    section: str = Field(default="Engineering", min_length=2, max_length=50)
    rack_id: str = Field(default="Rack A", min_length=2, max_length=30)
    shelf_level: str = Field(default="Eye Level", min_length=2, max_length=30)
    cover_image: Optional[str] = Field(default="", max_length=500)
    cover_url: Optional[str] = Field(default="", max_length=500)

    @field_validator("isbn")
    def clean_isbn(cls, v: str) -> str:
        clean = v.replace("-", "").replace(" ", "").strip()
        if len(clean) not in (10, 13):
            raise ValueError("ISBN must be exactly 10 or 13 digits (excluding hyphens)")
        return clean

class BookResponse(BaseModel):
    id: int
    isbn: str
    title: str
    author: str
    category: str
    course_branch: str
    semester: int
    publisher: str
    mrp: float
    selling_price: float
    stock_quantity: int
    is_preowned: bool
    condition_grade: str
    aisle_no: str
    section: str
    rack_id: str
    shelf_level: str
    cover_url: Optional[str]
    last_sold_at: str
    created_at: str

# ================= Buyback Schemas =================
class BuybackCalculateRequest(BaseModel):
    book_title: Optional[str] = Field(default="Textbook", max_length=200)
    original_mrp: float = Field(..., gt=0, le=50000, description="Original book MRP in INR")
    condition_grade: ConditionGrade = Field(default=ConditionGrade.Good, description="Physical book condition")

class BuybackCalculateResponse(BaseModel):
    book_title: Optional[str]
    original_mrp: float
    condition_grade: str
    depreciation_rate_percent: float
    buyback_amount_inr: float
    recommended_resale_price_inr: float

class BuybackExecuteRequest(BaseModel):
    student_prn: str = Field(..., min_length=4, max_length=30)
    student_name: str = Field(..., min_length=2, max_length=100)
    contact: Optional[str] = Field(default="9876543210", max_length=20)
    book_title: str = Field(..., min_length=2, max_length=200)
    isbn: Optional[str] = Field(default="N/A", max_length=30)
    original_mrp: float = Field(..., gt=0)
    condition_grade: ConditionGrade
    category: Optional[str] = Field(default="General")
    aisle_no: Optional[str] = Field(default="Aisle 1")
    section: Optional[str] = Field(default="Pre-Owned Section")
    rack_id: Optional[str] = Field(default="Rack P")
    shelf_level: Optional[str] = Field(default="Shelf 1")

# Aliases for backward compatibility
BuybackCalculationRequest = BuybackCalculateRequest
BuybackTransactionCreate = BuybackExecuteRequest

class BuybackResponse(BaseModel):
    id: int
    student_prn: str
    student_name: str
    book_title: str
    isbn: str
    original_mrp: float
    condition_grade: str
    depreciation_percent: float
    buyback_payout_inr: float
    new_wallet_balance_inr: float
    added_to_preowned_stock: bool
    created_at: str

# ================= Wallet Schemas =================
class StudentWalletResponse(BaseModel):
    prn: str
    student_name: str
    contact: str
    wallet_balance_inr: float
    updated_at: str

# ================= Syllabus Bundle Schemas =================
class BundleCreate(BaseModel):
    bundle_name: str = Field(..., min_length=3, max_length=120)
    course_branch: str = Field(..., min_length=2, max_length=50)
    semester: int = Field(..., ge=1, le=8)
    description: Optional[str] = Field(default="", max_length=500)
    discount_percent: float = Field(default=15.0, ge=0.0, le=50.0)
    book_ids: List[int] = Field(..., min_items=2, description="At least 2 books required for a bundle")

class BundleResponse(BaseModel):
    id: int
    bundle_name: str
    course_branch: str
    semester: int
    description: Optional[str]
    discount_percent: float
    total_original_mrp: float
    bundle_price: float
    savings_amount: float
    included_books: List[BookResponse]
    created_at: str

# ================= POS & Billing Schemas =================
class CartItemInput(BaseModel):
    book_id: int
    quantity: int = Field(default=1, ge=1, le=50)

CartItem = CartItemInput

class CheckoutRequest(BaseModel):
    customer_name: Optional[str] = Field(default="Walk-in Customer", max_length=100)
    customer_prn: Optional[str] = Field(default=None, max_length=30)
    items: List[CartItemInput] = Field(..., min_items=1)
    redeem_wallet: bool = Field(default=False)
    payment_method: PaymentMode = Field(default=PaymentMode.Cash)

POSCheckoutRequest = CheckoutRequest

class InvoiceItemResponse(BaseModel):
    book_id: Optional[int]
    title: str
    unit_price: float
    quantity: int
    total_price: float

OrderItemResponse = InvoiceItemResponse

class InvoiceResponse(BaseModel):
    invoice_no: str
    customer_name: Optional[str] = None
    customer_prn: Optional[str] = None
    subtotal_inr: float
    discount_inr: float
    wallet_redeemed_inr: float
    total_paid_inr: float
    payment_method: str
    created_at: str
    items: List[InvoiceItemResponse]

PaymentMethod = PaymentMode
