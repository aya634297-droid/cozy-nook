import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import confetti from "canvas-confetti";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Star, 
  Search, 
  X, 
  Loader2, 
  Bookmark, 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Pencil, 
  Trash2, 
  AlertTriangle, 
  Eye, 
  User, 
  StickyNote, 
  Sparkles,
  BookmarkCheck,
  Hash,
  Trophy,
  Palette,
  Lightbulb,
  Check,
  Power,
  ShoppingBag,
  DollarSign,
  MapPin,
  Calendar,
  Image,
  Download,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Layers,
  Flame,
  Play,
  Pause,
  Share2,
  BrainCircuit,
  Zap,
  Square,
  Settings,
  BarChart3,
  Mail,
  Archive,
  Globe,
  Sliders,
  Users,
  FolderPlus,
  DollarSign as MoneyIcon,
  ToggleLeft,
  ToggleRight,
  Coffee,
  Sparkle
} from "lucide-react";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // التنقل الرئيسي بين الأقسام
  const [activeMainPage, setActiveMainPage] = useState("home"); // home, wishlist, notes, collections, lending, archive, profile, settings, contact

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  // الثيمات والألوان
  const [themeMode, setThemeMode] = useState("purple");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#8b5cf6");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // 🔍 البحث التلقائي عن الكتب عبر Google Books API (ميزة Bookmory)
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // الثيمات الـ 7 الشاملة
  const presetThemes = [
    { id: "purple", name: "الغموض الملكي", color: "#8b5cf6", bg: "bg-black", card: "bg-zinc-950", border: "border-purple-900/40" },
    { id: "coffee", name: "دفء القهوة", color: "#8c6747", bg: "bg-[#14100d]", card: "bg-[#1f1915]", border: "border-[#423327]" },
    { id: "sepia", name: "ورقي كلاسيكي", color: "#b45309", bg: "bg-[#1c1917]", card: "bg-[#292524]", border: "border-[#44403c]" },
    { id: "emerald", name: "زمردي فاخر", color: "#10b981", bg: "bg-[#061712]", card: "bg-[#0b241c]", border: "border-[#134e3a]" },
    { id: "midnight", name: "أزرق نيلي", color: "#3b82f6", bg: "bg-[#090d16]", card: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { id: "rose", name: "وردي ناعم", color: "#f43f5e", bg: "bg-[#17090e]", card: "bg-[#240e16]", border: "border-[#4c1d24]" },
    { id: "slate", name: "رمادي رماد", color: "#64748b", bg: "bg-[#0f172a]", card: "bg-[#1e293b]", border: "border-[#334155]" },
  ];

  const currentThemeObj = themeMode === "custom" 
    ? { id: "custom", name: "لون مخصص", color: customPrimaryColor, bg: "bg-black", card: "bg-zinc-950", border: "border-zinc-800" }
    : (presetThemes.find((t) => t.id === themeMode) || presetThemes[0]);

  // الإعدادات
  const [settings, setSettings] = useState({
    showSessionReport: true,
    fontFamily: "sans",
    timeFormat: "12h",
    language: "ar",
    customLanguageName: "",
    fields: {
      price: true,
      purchaseLocation: true,
      purchaseDate: true,
      purchaseNotes: true,
      pdfUpload: true,
      series: true,
      rating: true
    }
  });

  const languagesList = [
    { code: "ar", name: "العربية (Arabic)" },
    { code: "en", name: "الإنجليزية (English)" },
    { code: "fr", name: "الفرنسية (French)" },
    { code: "de", name: "الألمانية (German)" },
    { code: "es", name: "الإسبانية (Spanish)" },
    { code: "it", name: "الإيطالية (Italian)" },
    { code: "ja", name: "اليابانية (Japanese)" },
    { code: "zh", name: "الصينية (Chinese)" },
    { code: "ko", name: "الكورية (Korean)" },
    { code: "ru", name: "الروسية (Russian)" },
    { code: "tr", name: "التركية (Turkish)" },
    { code: "hi", name: "الهندية (Hindi)" },
    { code: "pt", name: "البرتغالية (Portuguese)" },
    { code: "nl", name: "الهولندية (Dutch)" },
    { code: "sv", name: "السويدية (Swedish)" },
    { code: "custom", name: "✨ لغة أخرى (أدخل بنفسي)..." }
  ];

  // التحدي السنوي
  const [isGoalEnabled, setIsGoalEnabled] = useState(true);
  const [annualGoal, setAnnualGoal] = useState(10);
  const [goalType, setGoalType] = useState("books");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(10);

  // الهدف اليومي
  const [isDailyGoalEnabled, setIsDailyGoalEnabled] = useState(true);
  const [dailyGoalType, setDailyGoalType] = useState("pages");
  const [dailyTargetPages, setDailyTargetPages] = useState(20);
  const [dailyReadPages, setDailyReadPages] = useState(0);
  const [isDailyGoalAchieved, setIsDailyGoalAchieved] = useState(false);
  const [isEditingDailyGoal, setIsEditingGoalDaily] = useState(false);
  const [newDailyGoalInput, setNewDailyGoalInput] = useState(20);

  // مؤقت القراءة
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimerBook, setActiveTimerBook] = useState(null);
  const [sessionReport, setQuoteSessionReport] = useState(null);

  // المجموعات المخصصة
  const [customCollections, setCustomCollections] = useState([
    { id: 101, name: "روائع مروة گوهر", description: "روايات وألغاز الغموض", booksList: [] }
  ]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [openedCollection, setOpenedCollection] = useState(null);
  const [addingToCollectionId, setAddingToCollectionId] = useState(null);
  const [collectionAddMode, setCollectionAddMode] = useState("existing");
  const [selectedBookForCollection, setSelectedBookForCollection] = useState("");
  const [manualCollectionBook, setManualCollectionBook] = useState({ title: "", author: "" });

  // سجل الإعارات
  const [lendingList, setLendingList] = useState([]);
  const [lendingSearchQuery, setLendingSearchQuery] = useState("");
  const [newLending, setNewLending] = useState({ 
    borrowerName: "", 
    bookTitleInput: "", 
    lendDate: "", 
    expectedReturnDate: "",
    status: "borrowed"
  });
  const [editingLendingId, setEditingLendingId] = useState(null);

  // نافذة إضافة كتاب شراء أو رغبة
  const [addShoppingBookModalOpen, setAddShoppingBookModalOpen] = useState(false);
  const [shoppingModalType, setShoppingModalType] = useState("wishlist");
  const [shoppingBookForm, setShoppingBookForm] = useState({ title: "", author: "", price: "", location: "" });

  // نافذة إضافة ملاحظة عامة
  const [generalNoteModalOpen, setGeneralNoteModalOpen] = useState(false);
  const [generalNoteData, setGeneralNoteModalData] = useState({ bookId: "", content: "", chapter: "", page: "" });
  const [focusedNotePopup, setFocusedNotePopup] = useState(null);

  // نافذة تحويل كتاب لأرشيف المتوقف
  const [addDroppedModalOpen, setAddDroppedModalOpen] = useState(false);
  const [selectedDroppedBookId, setSelectedDroppedBookId] = useState("");

  // النوافذ الأساسية
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [activePdfTitle, setActivePdfTitle] = useState("");
  const [isZenMode, setIsZenMode] = useState(false);

  const [selectedBookDetails, setSelectedBookDetails] = useState(null);
  const [bookNotesList, setBookNotesList] = useState([]);
  const [allNotesList, setAllNotesList] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  // التحديث السريع
  const [quickProgressBook, setQuickProgressBook] = useState(null);
  const [quickProgressInput, setQuickProgressInput] = useState("");
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const [quickStatusBook, setQuickStatusBook] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // نموذج الملاحظات
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteChapter, setNewNoteChapter] = useState("");
  const [newNotePage, setNewNotePage] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [quoteToShare, setQuoteToShare] = useState(null);

  const [coverSource, setCoverSource] = useState("url");
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState(null);

  const [selectedCategoriesList, setSelectedCategoriesList] = useState(["روايات"]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const availableCategories = [
    "روايات", "جريمة وغموض", "رعب وسيكولوجي", "تطوير الذات", 
    "فلسفة وفكر", "تاريخ وسياسة", "علم نفس", "أدب مترجم", 
    "شعر وأدب", "علوم وتكنولوجيا"
  ];

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    status: "reading",
    progress: "",
    totalPages: "",
    rating: 5,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    pdf_url: "",
    is_purchased: false,
    price: "",
    purchase_location: "",
    purchase_date: "",
    purchase_notes: "",
    purchase_receipt_url: "",
    is_series: false,
    series_name: "",
    part_number: ""
  });

  useEffect(() => {
    fetchBooks();
    fetchReadingGoal();
    fetchAllNotes();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function triggerCelebration() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  // 🔍 البحث التلقائي عبر Google Books API (ميزة Bookmory)
  async function searchGoogleBooksAPI(query) {
    if (!query.trim()) return;
    setIsSearchingApi(true);
    setHasSearched(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6`);
      const data = await response.json();
      if (data && data.items) {
        setApiSearchResults(data.items);
      } else {
        setApiSearchResults([]);
      }
    } catch (err) {
      console.error("Error fetching Google Books:", err);
      setApiSearchResults([]);
    } finally {
      setIsSearchingApi(false);
    }
  }

  function handleSelectGoogleBook(item) {
    const info = item.volumeInfo || {};
    let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";
    
    if (coverUrl.startsWith("http://")) {
      coverUrl = coverUrl.replace("http://", "https://");
    }

    const authorName = Array.isArray(info.authors) ? info.authors.join(", ") : (info.authors || "");

    setNewBook({
      ...newBook,
      title: info.title || "",
      author: authorName,
      totalPages: info.pageCount ? String(info.pageCount) : "",
      cover: coverUrl
    });

    setCoverSource("url");
    setApiSearchResults([]);
    setApiSearchQuery("");
    setHasSearched(false);
  }

  async function fetchBooks() {
    setLoading(true);
    const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });
    if (!error) {
      setBooks(data || []);
    }
    setLoading(false);
  }

  async function fetchAllNotes() {
    const { data } = await supabase.from("book_notes").select("*, books(title, author, cover)").order("id", { ascending: false });
    if (data) setAllNotesList(data);
  }

  async function fetchReadingGoal() {
    const { data } = await supabase.from("reading_goals").select("*").eq("year", 2026).maybeSingle();
    if (data) {
      setAnnualGoal(data.target_books || 10);
      setNewGoalInput(data.target_books || 10);
    }
  }

  async function saveReadingGoal() {
    const target = Number(newGoalInput);
    if (isNaN(target) || target < 1) return;

    setAnnualGoal(target);
    setIsEditingGoal(false);

    await supabase.from("reading_goals").upsert({ year: 2026, target_books: target }, { onConflict: "year" });
  }

  async function uploadFileToStorage(file, bucketName) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);

    if (error) return null;

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async function openBookDetails(book) {
    setSelectedBookDetails(book);
    setShowAddNoteForm(false);
    fetchBookNotes(book.id);
  }

  function closeBookDetails() {
    setSelectedBookDetails(null);
  }

  async function fetchBookNotes(bookId) {
    setLoadingNotes(true);
    const { data } = await supabase.from("book_notes").select("*").eq("book_id", bookId).order("id", { ascending: false });
    setBookNotesList(data || []);
    setLoadingNotes(false);
  }

  function startBookTimer(book) {
    setActiveTimerBook(book);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  }

  function stopBookTimerAndPrompt() {
    setIsTimerRunning(false);
    if (!activeTimerBook) return;

    const bookToUpdate = activeTimerBook;

    setQuickProgressBook(bookToUpdate);
    setQuickProgressInput(bookToUpdate.progress || "");
    setActiveTimerBook(null);
  }

  async function handleQuickProgressUpdate(e) {
    e.preventDefault();
    if (!quickProgressBook) return;
    const newProgressVal = Number(quickProgressInput);
    if (isNaN(newProgressVal) || newProgressVal < 0) return alert("يرجى إدخال رقم صحيح");

    const oldPage = quickProgressBook.progress || 0;
    const addedPages = Math.max(0, newProgressVal - oldPage);
    const totalPages = quickProgressBook.totalPages || 1;

    const progressGainPercent = Math.min(100, Math.round((addedPages / totalPages) * 100));
    const totalProgressPercent = Math.min(100, Math.round((newProgressVal / totalPages) * 100));

    const elapsedMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const timePerPage = addedPages > 0 ? (elapsedMinutes / addedPages).toFixed(1) : 1;

    const suggestedNextPages = Math.round(addedPages * 1.5) || 20;
    const suggestedNextTime = Math.round(suggestedNextPages * timePerPage) || 30;

    const newDailyTotal = dailyReadPages + addedPages;
    setDailyReadPages(newDailyTotal);

    if (isDailyGoalEnabled && newDailyTotal >= dailyTargetPages && !isDailyGoalAchieved) {
      setIsDailyGoalAchieved(true);
      triggerCelebration();
    }

    setIsUpdatingProgress(true);

    const { data, error } = await supabase
      .from("books")
      .update({ progress: newProgressVal })
      .eq("id", quickProgressBook.id)
      .select();

    if (!error && data && data.length > 0) {
      setBooks(books.map((b) => (b.id === quickProgressBook.id ? data[0] : b)));
      if (selectedBookDetails && selectedBookDetails.id === quickProgressBook.id) {
        setSelectedBookDetails(data[0]);
      }

      if (settings.showSessionReport) {
        setQuoteSessionReport({
          bookTitle: quickProgressBook.title,
          addedPages,
          newProgressVal,
          elapsedMinutes,
          progressGainPercent,
          totalProgressPercent,
          timePerPage,
          suggestedNextPages,
          suggestedNextTime
        });
      }

      setQuickProgressBook(null);
      setQuickProgressInput("");
      setTimerSeconds(0);
    }
    setIsUpdatingProgress(false);
  }

  async function handleQuickStatusUpdate(newStatus) {
    if (!quickStatusBook) return;
    setIsUpdatingStatus(true);

    let updatedFields = { status: newStatus };

    if (newStatus === "finished") {
      if (quickStatusBook.totalPages > 0) {
        updatedFields.progress = quickStatusBook.totalPages;
      }
      triggerCelebration();
    }

    const { data, error } = await supabase
      .from("books")
      .update(updatedFields)
      .eq("id", quickStatusBook.id)
      .select();

    if (!error && data && data.length > 0) {
      setBooks(books.map((b) => (b.id === quickStatusBook.id ? data[0] : b)));
      if (selectedBookDetails && selectedBookDetails.id === quickStatusBook.id) {
        setSelectedBookDetails(data[0]);
      }
      setQuickStatusBook(null);
    }
    setIsUpdatingStatus(false);
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!newNoteContent.trim() || !selectedBookDetails) return;

    setIsSavingNote(true);

    const noteToSave = {
      book_id: selectedBookDetails.id,
      content: newNoteContent.trim(),
      chapter: newNoteChapter.trim() || null,
      page_number: newNotePage !== "" ? Number(newNotePage) : null
    };

    const { data, error } = await supabase.from("book_notes").insert([noteToSave]).select();

    if (!error && data && data.length > 0) {
      setBookNotesList([data[0], ...bookNotesList]);
      setNewNoteContent("");
      setNewNoteChapter("");
      setNewNotePage("");
      setShowAddNoteForm(false);
      fetchAllNotes();
    }
    setIsSavingNote(false);
  }

  async function handleSaveShoppingBook(e) {
    e.preventDefault();
    if (!shoppingBookForm.title.trim() || !shoppingBookForm.author.trim()) {
      return alert("يرجى كتابة عنوان الكتاب واسم الكاتب");
    }

    const isPurchased = shoppingModalType === "purchased";

    const bookDataToSave = {
      title: shoppingBookForm.title.trim(),
      author: shoppingBookForm.author.trim(),
      category: "روايات",
      categories: ["روايات"],
      status: isPurchased ? "reading" : "want_to_read",
      progress: 0,
      totalPages: 0,
      rating: 5,
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
      pdf_url: null,
      is_purchased: isPurchased,
      price: isPurchased && shoppingBookForm.price ? Number(shoppingBookForm.price) : null,
      purchase_location: isPurchased && shoppingBookForm.location ? shoppingBookForm.location.trim() : null,
      purchase_date: isPurchased ? new Date().toISOString().split('T')[0] : null,
      purchase_notes: null,
      purchase_receipt_url: null,
      series_name: null,
      part_number: null
    };

    try {
      const { data, error } = await supabase.from("books").insert([bookDataToSave]).select();

      if (error) {
        console.error("Supabase Error:", error);
        alert(`حدث خطأ أثناء الإضافة: ${error.message}`);
      } else if (data && data.length > 0) {
        setBooks([data[0], ...books]);
        setAddShoppingBookModalOpen(false);
        setShoppingBookForm({ title: "", author: "", price: "", location: "" });
        triggerCelebration();
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع أثناء الحفظ.");
    }
  }

  async function handleAddGeneralNote(e) {
    e.preventDefault();
    if (!generalNoteData.content.trim() || !generalNoteData.bookId) return alert("اختر الكتاب واكتب الملاحظة");

    const noteToSave = {
      book_id: Number(generalNoteData.bookId),
      content: generalNoteData.content.trim(),
      chapter: generalNoteData.chapter.trim() || null,
      page_number: generalNoteData.page !== "" ? Number(generalNoteData.page) : null
    };

    const { data, error } = await supabase.from("book_notes").insert([noteToSave]).select();
    if (!error && data && data.length > 0) {
      setGeneralNoteModalOpen(false);
      setGeneralNoteModalData({ bookId: "", content: "", chapter: "", page: "" });
      fetchAllNotes();
    }
  }

  function handleAddBookToCollection(e) {
    e.preventDefault();
    if (!addingToCollectionId) return;

    let bookObj = null;

    if (collectionAddMode === "manual") {
      if (!manualCollectionBook.title) return alert("أدخلي اسم الكتاب");
      bookObj = { title: manualCollectionBook.title, author: manualCollectionBook.author || "مؤلف" };
    } else {
      if (!selectedBookForCollection) return alert("اختر كتاباً من القائمة");
      bookObj = books.find((b) => b.id === Number(selectedBookForCollection));
    }

    if (bookObj) {
      setCustomCollections(customCollections.map((col) => {
        if (col.id === addingToCollectionId) {
          return { ...col, booksList: [...(col.booksList || []), bookObj] };
        }
        return col;
      }));
    }

    setAddingToCollectionId(null);
    setSelectedBookForCollection("");
    setManualCollectionBook({ title: "", author: "" });
  }

  async function handleAddDroppedBook() {
    if (!selectedDroppedBookId) return;
    const { data } = await supabase.from("books").update({ status: "dropped" }).eq("id", Number(selectedDroppedBookId)).select();
    if (data && data.length > 0) {
      setBooks(books.map((b) => (b.id === Number(selectedDroppedBookId) ? data[0] : b)));
      setAddDroppedModalOpen(false);
      setSelectedDroppedBookId("");
    }
  }

  async function handleDeleteNote(noteId) {
    const { error } = await supabase.from("book_notes").delete().eq("id", noteId);
    if (!error) {
      setBookNotesList(bookNotesList.filter((n) => n.id !== noteId));
      setAllNotesList(allNotesList.filter((n) => n.id !== noteId));
    }
  }

  function toggleCategorySelection(cat) {
    if (selectedCategoriesList.includes(cat)) {
      if (selectedCategoriesList.length > 1) {
        setSelectedCategoriesList(selectedCategoriesList.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategoriesList([...selectedCategoriesList, cat]);
    }
  }

  function handleAddCustomCategory() {
    if (customCategoryInput.trim() && !selectedCategoriesList.includes(customCategoryInput.trim())) {
      setSelectedCategoriesList([...selectedCategoriesList, customCategoryInput.trim()]);
      setCustomCategoryInput("");
    }
  }

  function handleOpenEditModal(book) {
    setEditingBookId(book.id);
    setSelectedCategoriesList(
      book.categories && book.categories.length > 0 
        ? book.categories 
        : [book.category || "روايات"]
    );

    setNewBook({
      title: book.title || "",
      author: book.author || "",
      status: book.status || "reading",
      progress: book.progress ?? "",
      totalPages: book.totalPages ?? "",
      rating: book.rating || 5,
      cover: book.cover || "",
      pdf_url: book.pdf_url || "",
      is_purchased: book.is_purchased || false,
      price: book.price || "",
      purchase_location: book.purchase_location || "",
      purchase_date: book.purchase_date || "",
      purchase_notes: book.purchase_notes || "",
      purchase_receipt_url: book.purchase_receipt_url || "",
      is_series: !!book.series_name,
      series_name: book.series_name || "",
      part_number: book.part_number || ""
    });

    setCoverSource("url");
    setSelectedCoverFile(null);
    setSelectedPdfFile(null);
    setSelectedReceiptFile(null);
    setIsModalOpen(true);
  }

  async function handleSaveBook(e) {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return alert("يرجى كتابة عنوان الكتاب واسم المؤلف");

    setIsSubmitting(true);

    try {
      let finalCoverUrl = newBook.cover;
      let finalPdfUrl = newBook.pdf_url;
      let finalReceiptUrl = newBook.purchase_receipt_url;

      if (coverSource === "file" && selectedCoverFile) {
        const uploadedCover = await uploadFileToStorage(selectedCoverFile, "covers");
        if (uploadedCover) finalCoverUrl = uploadedCover;
      }

      if (selectedPdfFile) {
        const uploadedPdf = await uploadFileToStorage(selectedPdfFile, "covers");
        if (uploadedPdf) finalPdfUrl = uploadedPdf;
      }

      if (selectedReceiptFile) {
        const uploadedReceipt = await uploadFileToStorage(selectedReceiptFile, "covers");
        if (uploadedReceipt) finalReceiptUrl = uploadedReceipt;
      }

      const primaryCategory = selectedCategoriesList[0] || "روايات";

      const bookDataToSave = {
        title: newBook.title,
        author: newBook.author,
        category: primaryCategory,
        categories: selectedCategoriesList,
        status: newBook.status,
        progress: newBook.progress === "" ? 0 : Number(newBook.progress),
        totalPages: newBook.totalPages === "" ? 0 : Number(newBook.totalPages),
        rating: Number(newBook.rating),
        cover: finalCoverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
        pdf_url: finalPdfUrl || null,
        is_purchased: newBook.is_purchased,
        price: newBook.price !== "" ? Number(newBook.price) : null,
        purchase_location: newBook.purchase_location || null,
        purchase_date: newBook.purchase_date || null,
        purchase_notes: newBook.purchase_notes || null,
        purchase_receipt_url: finalReceiptUrl || null,
        series_name: newBook.is_series && newBook.series_name ? newBook.series_name.trim() : null,
        part_number: newBook.is_series && newBook.part_number !== "" ? Number(newBook.part_number) : null
      };

      if (editingBookId) {
        const { data, error } = await supabase
          .from("books")
          .update(bookDataToSave)
          .eq("id", editingBookId)
          .select();

        if (!error && data && data.length > 0) {
          setBooks(books.map((b) => (b.id === editingBookId ? data[0] : b)));
          if (selectedBookDetails && selectedBookDetails.id === editingBookId) {
            setSelectedBookDetails(data[0]);
          }
          resetForm();
          setIsModalOpen(false);
        }
      } else {
        const { data, error } = await supabase.from("books").insert([bookDataToSave]).select();

        if (!error && data && data.length > 0) {
          setBooks([data[0], ...books]);
          resetForm();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function triggerDeleteModal(book) {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteBook() {
    if (!bookToDelete) return;
    setIsDeleting(true);

    const { error } = await supabase.from("books").delete().eq("id", bookToDelete.id);

    if (!error) {
      setBooks(books.filter((b) => b.id !== bookToDelete.id));
      if (selectedBookDetails && selectedBookDetails.id === bookToDelete.id) {
        closeBookDetails();
      }
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
    setIsDeleting(false);
  }

  function openPdfViewer(url, title) {
    setActivePdfUrl(url);
    setActivePdfTitle(title);
    setIsZenMode(false);
    setPdfModalOpen(true);
  }

  function exportBooksData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `my_library_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function resetForm() {
    setEditingBookId(null);
    setSelectedCategoriesList(["روايات"]);
    setCustomCategoryInput("");
    setNewBook({
      title: "",
      author: "",
      status: "reading",
      progress: "",
      totalPages: "",
      rating: 5,
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
      pdf_url: "",
      is_purchased: false,
      price: "",
      purchase_location: "",
      purchase_date: "",
      purchase_notes: "",
      purchase_receipt_url: "",
      is_series: false,
      series_name: "",
      part_number: ""
    });
    setCoverSource("url");
    setSelectedCoverFile(null);
    setSelectedPdfFile(null);
    setSelectedReceiptFile(null);
  }

  const totalBooks = books.length;
  const finishedBooks = books.filter((b) => b.status === "finished").length;
  const readingBooks = books.filter((b) => b.status === "reading").length;
  const wantToReadBooks = books.filter((b) => b.status === "want_to_read").length;
  const droppedBooks = books.filter((b) => b.status === "dropped");
  const purchasedBooksList = books.filter((b) => b.is_purchased);
  const wishlistBooksList = books.filter((b) => !b.is_purchased);

  const totalLibraryCost = purchasedBooksList.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const currentBook = books.find((b) => b.status === "reading");
  const goalPercentage = annualGoal > 0 ? Math.min(Math.round((finishedBooks / annualGoal) * 100), 100) : 0;

  const seriesRelatedBooks = selectedBookDetails && selectedBookDetails.series_name
    ? books.filter((b) => b.series_name === selectedBookDetails.series_name && b.id !== selectedBookDetails.id)
    : [];

  const filteredBooks = books.filter((book) => {
    const matchesTab = activeTab === "all" ? true : book.status === activeTab;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.categories && book.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTab && matchesSearch;
  });

  const filteredLendingList = lendingList.filter((l) =>
    l.borrowerName.toLowerCase().includes(lendingSearchQuery.toLowerCase()) ||
    (l.bookTitle && l.bookTitle.toLowerCase().includes(lendingSearchQuery.toLowerCase()))
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "reading": return "قيد القراءة";
      case "finished": return "مكتمل";
      case "want_to_read": return "أقرأه لاحقاً";
      case "dropped": return "متوقف (تخليت عنه)";
      default: return "أخرى";
    }
  };

  const categoriesForShelves = Array.from(
    new Set(books.flatMap((b) => (b.categories && b.categories.length > 0 ? b.categories : [b.category || "روايات"])))
  );

  const formatTimerTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getLendingStatusObj = (item) => {
    if (item.isReturned || item.status === "returned") {
      return { label: "تم الاسترجاع ✓", style: "bg-emerald-950 border-emerald-800 text-emerald-300" };
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (item.expectedReturnDate && item.expectedReturnDate < todayStr) {
      return { label: "متأخر عن الموعد! 🚨", style: "bg-red-950 border-red-800 text-red-300 font-bold" };
    }
    return { label: "قيد الإعارة ⏳", style: "bg-amber-950 border-amber-800 text-amber-300" };
  };

  return (
    <div className={`min-h-screen ${currentThemeObj.bg} text-slate-100 font-sans transition-colors duration-500 relative`} dir="rtl">
      
      {/* Header الرئيسي باسم Cozy Nook والأيقونات الملونة المشرقة */}
      <header className={`border-b ${currentThemeObj.border} bg-black/90 backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl border border-amber-500/40 bg-amber-950/40 text-amber-400 shadow-md">
              <Coffee className="w-5 h-5 animate-pulse" />
            </div>
            <div className="p-2.5 rounded-2xl border border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-amber-200 via-purple-300 to-purple-500 bg-clip-text text-transparent tracking-wide">
                Cozy Nook ☕📖
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">منطقة الراحة وملاذكِ الدافي مع الكتب</p>
            </div>
          </div>

          {/* شريط الأقسام */}
          <nav className="flex items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-900 overflow-x-auto max-w-full">
            {[
              { id: "home", label: "الرئيسية", icon: BookOpen },
              { id: "wishlist", label: "المشتريات والرغبات والميزانية", icon: ShoppingBag },
              { id: "notes", label: "دفتر الملاحظات", icon: StickyNote },
              { id: "collections", label: "المجموعات المخصصة", icon: FolderPlus },
              { id: "lending", label: "سجل الإعارة", icon: Users },
              { id: "archive", label: "المتوقف عن قراءته", icon: Archive },
              { id: "profile", label: "ملفي الشخصي", icon: User },
              { id: "settings", label: "الإعدادات", icon: Settings },
              { id: "contact", label: "تواصل معنا", icon: Mail }
            ].map((p) => {
              const IconComp = p.icon;
              const isActive = activeMainPage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveMainPage(p.id)}
                  style={{ backgroundColor: isActive ? currentThemeObj.color : "transparent" }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
                    isActive ? "text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${currentThemeObj.border} bg-black/50 hover:bg-zinc-900 transition text-xs font-semibold cursor-pointer`}
              >
                <Palette className="w-4 h-4" style={{ color: currentThemeObj.color }} />
                <span className="hidden sm:inline">السمة</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-50 space-y-2">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-zinc-300">اختر سمة الألوان (7 ثيمات)</span>
                    <button onClick={() => setIsThemeMenuOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {presetThemes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemeMode(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer hover:bg-zinc-900 ${
                          themeMode === t.id ? "bg-zinc-900 font-bold" : "text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.color }}></span>
                          <span>{t.name}</span>
                        </div>
                        {themeMode === t.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-900 space-y-1">
                    <span className="text-[11px] text-zinc-500 block">أو اختر لونك الخاص المفضل:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customPrimaryColor}
                        onChange={(e) => {
                          setCustomPrimaryColor(e.target.value);
                          setThemeMode("custom");
                        }}
                        className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs text-zinc-300">تخصيص حر 🎨</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={exportBooksData}
              title="تصدير نسخة احتياطية من مكتبتك"
              className={`p-2 rounded-xl border ${currentThemeObj.border} bg-black/50 hover:bg-zinc-900 transition text-zinc-400 hover:text-white cursor-pointer`}
            >
              <Download className="w-4 h-4" />
            </button>

            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              style={{ backgroundColor: currentThemeObj.color }}
              className="flex items-center gap-1.5 text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-lg text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب جديد</span>
            </button>
          </div>
        </div>
      </header>

      {/* 🏠 الصفحة الرئيسية (Home Page) */}
      {activeMainPage === "home" && (
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          
          {/* الأرقام المجمعة التفاعلية */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                onClick={() => setActiveTab("all")} 
                className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-purple-600 transition`}
              >
                <div className="p-3 rounded-xl border border-white/10" style={{ color: currentThemeObj.color }}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">إجمالي الكتب</p>
                  <p className="text-xl font-bold text-zinc-100">{totalBooks}</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("finished")} 
                className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-emerald-600 transition`}
              >
                <div className="p-3 bg-emerald-950/30 rounded-xl text-emerald-400 border border-emerald-900/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">مكتملة القراءة</p>
                  <p className="text-xl font-bold text-zinc-100">{finishedBooks}</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("reading")} 
                className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-purple-600 transition`}
              >
                <div className="p-3 rounded-xl border border-white/10" style={{ color: currentThemeObj.color }}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">قيد القراءة حالياً</p>
                  <p className="text-xl font-bold text-zinc-100">{readingBooks}</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("want_to_read")} 
                className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-blue-600 transition`}
              >
                <div className="p-3 bg-blue-950/30 rounded-xl text-blue-400 border border-blue-900/30">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">أقرأه لاحقاً</p>
                  <p className="text-xl font-bold text-zinc-100">{wantToReadBooks}</p>
                </div>
              </div>
            </div>

            {/* 🎯 الأهداف اليومية والسنوية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الهدف اليومي */}
              <div className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-3xl p-5 shadow-xl space-y-3`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-950/40 border border-orange-900/50 rounded-2xl text-orange-400">
                      <Flame className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-zinc-100">الهدف اليومي للقراءة 🔥</h3>
                      <p className="text-[11px] text-zinc-400">تخصيص هدف بالصفحات أو الدقائق</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDailyGoalEnabled(!isDailyGoalEnabled)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer ${
                      isDailyGoalEnabled ? "bg-orange-950 border-orange-800 text-orange-300" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isDailyGoalEnabled ? "مفعّل" : "تفعيل"}</span>
                  </button>
                </div>

                {isDailyGoalEnabled && (
                  <div className="pt-2 border-t border-zinc-900/80 space-y-2 text-xs">
                    {isEditingDailyGoal ? (
                      <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                        <select
                          value={dailyGoalType}
                          onChange={(e) => setDailyGoalType(e.target.value)}
                          className="bg-black border border-zinc-800 rounded-xl px-2 py-1 text-xs text-zinc-200"
                        >
                          <option value="pages">عدد الصفحات 📖</option>
                          <option value="minutes">عدد الدقائق/ساعات ⏱️</option>
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={newDailyGoalInput}
                          onChange={(e) => setNewDailyGoalInput(e.target.value)}
                          className="w-20 bg-black border border-zinc-800 rounded-xl px-3 py-1 text-xs text-zinc-200 outline-none"
                        />
                        <button
                          onClick={() => {
                            setDailyTargetPages(Number(newDailyGoalInput) || 20);
                            setIsEditingGoalDaily(false);
                          }}
                          className="bg-orange-900 hover:bg-orange-800 text-orange-100 text-xs px-3 py-1 rounded-xl font-bold cursor-pointer"
                        >
                          حفظ
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-zinc-300">
                          قرأتِ اليوم <strong className="text-orange-400">{dailyReadPages}</strong> من أصل <strong className="text-white">{dailyTargetPages}</strong> {dailyGoalType === "pages" ? "صفحة" : "دقيقة"}.
                        </p>
                        <button onClick={() => setIsEditingGoalDaily(true)} className="text-[10px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg cursor-pointer">
                          تعديل ✏️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* تحدي القراءة السنوي */}
              <div className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-3xl p-5 shadow-xl space-y-3`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded-2xl text-amber-400">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-zinc-100">تحدي القراءة السنوي (2026) 🏆</h3>
                      <p className="text-[11px] text-zinc-400">إجمالي الكتب المكتملة</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsGoalEnabled(!isGoalEnabled)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer ${
                      isGoalEnabled ? "bg-amber-950 border-amber-800 text-amber-300" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isGoalEnabled ? "مفعّل" : "تفعيل"}</span>
                  </button>
                </div>

                {isGoalEnabled && (
                  <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between text-xs">
                    {isEditingGoal ? (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <select
                          value={goalType}
                          onChange={(e) => setGoalType(e.target.value)}
                          className="bg-black border border-zinc-800 rounded-xl px-2 py-1 text-xs text-zinc-200"
                        >
                          <option value="books">عدد الكتب 📚</option>
                          <option value="hours">عدد الساعات ⏱️</option>
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={newGoalInput}
                          onChange={(e) => setNewGoalInput(e.target.value)}
                          className="w-20 bg-black border border-zinc-800 rounded-xl px-3 py-1 text-xs text-zinc-200 outline-none"
                        />
                        <button
                          onClick={saveReadingGoal}
                          className="bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs px-3 py-1 rounded-xl font-bold cursor-pointer"
                        >
                          حفظ
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-zinc-300">
                          أكملتِ <strong className="text-amber-400">{finishedBooks}</strong> {goalType === "books" ? "كتب" : "ساعة"} من أصل <strong className="text-white">{annualGoal}</strong>.
                        </p>
                        <button onClick={() => setIsEditingGoal(true)} className="text-[10px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg cursor-pointer">
                          تعديل ✏️
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Current Book */}
          {currentBook && (
            <section className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-3xl p-6 relative overflow-hidden shadow-2xl`}>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={currentBook.cover}
                  alt={currentBook.title}
                  onClick={() => openBookDetails(currentBook)}
                  className="w-32 h-48 object-cover rounded-xl shadow-2xl border border-zinc-800 cursor-pointer hover:scale-105 transition"
                />
                <div className="flex-1 space-y-4 text-center md:text-right">
                  <div className="inline-flex items-center gap-2 bg-black/60 border border-white/10 text-xs px-3 py-1 rounded-full font-semibold" style={{ color: currentThemeObj.color }}>
                    <Clock className="w-3.5 h-3.5" /> تقرأين الآن
                  </div>
                  <div>
                    <h2 onClick={() => openBookDetails(currentBook)} className="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition">
                      {currentBook.title}
                    </h2>
                    <p className="text-zinc-400 text-sm">{currentBook.author}</p>
                  </div>

                  <div className="space-y-2 max-w-md mx-auto md:mx-0">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>نسبة الإنجاز</span>
                      <span>
                        ص {currentBook.progress || 0} / {currentBook.totalPages || 0} (
                        {currentBook.totalPages > 0 ? Math.round((currentBook.progress / currentBook.totalPages) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: currentThemeObj.color,
                          width: `${currentBook.totalPages > 0 ? (currentBook.progress / currentBook.totalPages) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-2">
                    <button
                      onClick={() => startBookTimer(currentBook)}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-800/80 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
                      <span>بدء مؤقت قراءة هذا الكتاب ⏱️</span>
                    </button>

                    <button
                      onClick={() => {
                        setQuickProgressBook(currentBook);
                        setQuickProgressInput(currentBook.progress || "");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>تحديث الصفحات مباشرة</span>
                    </button>

                    <button
                      onClick={() => openBookDetails(currentBook)}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-200 bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>التفاصيل والملاحظات</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Filter and Search */}
          <section className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className={`flex flex-wrap ${currentThemeObj.card} p-1.5 rounded-2xl border ${currentThemeObj.border} w-full sm:w-auto gap-1`}>
              {[
                { id: "all", label: `الكل (${books.length})` },
                { id: "reading", label: `أقرؤه الآن (${readingBooks})` },
                { id: "finished", label: `مكتملة (${finishedBooks})` },
                { id: "want_to_read", label: `لاحقاً (${wantToReadBooks})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ backgroundColor: activeTab === tab.id ? currentThemeObj.color : "transparent" }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    activeTab === tab.id ? "text-white font-bold" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute right-4 top-3 text-purple-400" />
              <input
                type="text"
                placeholder="ابحثي هنا عن كتاب، مؤلف، أو تصنيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/80 border-2 border-purple-900/80 rounded-2xl pr-11 pl-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none transition shadow-lg"
              />
            </div>
          </section>

          {/* تقسيم الكتب أرفف حسب التصنيفات */}
          {loading ? (
            <div className="flex justify-center items-center py-20 text-zinc-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">جاري جلب كتبكِ من السيرفر...</span>
            </div>
          ) : (
            <div className="space-y-10">
              {categoriesForShelves.map((catName) => {
                const booksInCat = filteredBooks.filter((b) =>
                  b.categories && b.categories.length > 0
                    ? b.categories.includes(catName)
                    : (b.category || "روايات") === catName
                );

                if (booksInCat.length === 0) return null;

                return (
                  <section key={catName} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4" style={{ color: currentThemeObj.color }} />
                        <span>قسم: {catName}</span>
                        <span className="text-xs text-zinc-500 font-normal">({booksInCat.length})</span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {booksInCat.map((book) => (
                        <div
                          key={book.id}
                          className={`group ${currentThemeObj.card} border ${currentThemeObj.border} rounded-2xl p-3 transition duration-300 hover:-translate-y-1 flex flex-col justify-between relative cursor-pointer`}
                          onClick={() => openBookDetails(book)}
                        >
                          <div>
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-zinc-900 border border-zinc-900">
                              <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                              {book.series_name && (
                                <span className="absolute bottom-2 right-2 bg-purple-950/90 border border-purple-800 text-purple-200 text-[9px] px-2 py-0.5 rounded-md font-bold max-w-[90%] truncate">
                                  🔗 {book.series_name} {book.part_number && `(ج${book.part_number})`}
                                </span>
                              )}

                              <div 
                                className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-300 bg-black/80 p-1 rounded-lg border border-zinc-800 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleOpenEditModal(book)}
                                  title="تعديل بيانات الكتاب"
                                  className="text-zinc-300 hover:text-purple-400 p-1 transition cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteModal(book)}
                                  title="حذف الكتاب"
                                  className="text-zinc-300 hover:text-red-400 p-1 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h3 className="font-bold text-sm text-zinc-200 line-clamp-1">{book.title}</h3>
                            <p className="text-zinc-500 text-xs mb-2">{book.author}</p>
                          </div>

                          <div className="pt-2 border-t border-zinc-900 space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5" style={{ color: currentThemeObj.color }}>
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold text-zinc-300">{book.rating}</span>
                              </div>
                              <button onClick={() => setQuickStatusBook(book)} className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                                {getStatusLabel(book.status)}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* 🛒 الصفحة المدمجة الشاملة: المشتريات + رغبات الشراء + الميزانية والمصروفات */}
      {activeMainPage === "wishlist" && (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-2 shadow-xl">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-bold">
                <MoneyIcon className="w-4 h-4 text-emerald-400" />
                <span>إجمالي قيمة كتب المكتبة المالكة</span>
              </span>
              <p className="text-3xl font-black text-emerald-400">{totalLibraryCost} ج.م</p>
              <p className="text-[11px] text-zinc-500">حساب مجمع لأسعار الكتب المشتراة</p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-2 shadow-xl">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>أكتر نوع بقرأه</span>
              </span>
              <p className="text-2xl font-bold text-purple-300">{categoriesForShelves[0] || "روايات"}</p>
              <p className="text-[11px] text-zinc-500">بناءً على تصنيف كتبكِ في المكتبة</p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-2 shadow-xl">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-bold">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>إجمالي الكتب المشتراة</span>
              </span>
              <p className="text-3xl font-black text-amber-400">{purchasedBooksList.length} كتاب</p>
              <p className="text-[11px] text-zinc-500">مقابل {wishlistBooksList.length} كتاب في قائمة الرغبات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الكتب المشترات */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>الكتب المملوكة المشتراة ({purchasedBooksList.length})</span>
                </h3>
                <button
                  onClick={() => { setShoppingModalType("purchased"); setAddShoppingBookModalOpen(true); }}
                  className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                >
                  + إضافة كتاب مشتريات
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {purchasedBooksList.map((b) => (
                  <div key={b.id} className="bg-black/60 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openBookDetails(b)}>
                      <img src={b.cover} alt="" className="w-10 h-14 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{b.title}</h4>
                        <p className="text-[10px] text-zinc-400">{b.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.price && <span className="text-xs font-bold text-emerald-400">{b.price} ج.م</span>}
                      <button onClick={() => triggerDeleteModal(b)} className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* قائمة الرغبات Wishlist */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>الكتب المرغوب في شرائها مستقبلاً ({wishlistBooksList.length})</span>
                </h3>
                <button
                  onClick={() => { setShoppingModalType("wishlist"); setAddShoppingBookModalOpen(true); }}
                  className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                >
                  + إضافة كتاب للأمنيات
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {wishlistBooksList.map((b) => (
                  <div key={b.id} className="bg-black/60 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openBookDetails(b)}>
                      <img src={b.cover} alt="" className="w-10 h-14 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{b.title}</h4>
                        <p className="text-[10px] text-zinc-400">{b.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded-lg">في الأمنيات</span>
                      <button onClick={() => triggerDeleteModal(b)} className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 📝 صفحة دفتر الملاحظات الشامل لجميع الكتب */}
      {activeMainPage === "notes" && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-zinc-900 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
              <StickyNote className="w-6 h-6" />
              <span>دفتر الملاحظات والاقتباسات الكلي ({allNotesList.length})</span>
            </h2>

            <button
              onClick={() => setGeneralNoteModalOpen(true)}
              style={{ backgroundColor: currentThemeObj.color }}
              className="text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-md cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة ملاحظة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allNotesList.map((n) => (
              <div 
                key={n.id} 
                onClick={() => setFocusedNotePopup(n)}
                className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl space-y-3 shadow-lg cursor-pointer hover:border-purple-800 transition flex flex-col justify-between"
              >
                <p className="text-xs text-zinc-200 leading-relaxed italic line-clamp-3">"{n.content}"</p>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[11px] text-zinc-500">
                  <span>{n.books?.title || "كتاب من المكتبة"}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setQuoteToShare({ book: n.books || { title: "ملاحظة" }, note: n })} className="text-zinc-500 hover:text-purple-400 p-1 cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteNote(n.id)} className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 📁 صفحة المجموعات المخصصة */}
      {activeMainPage === "collections" && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-zinc-900 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
              <FolderPlus className="w-6 h-6" />
              <span>المجموعات المخصصة لقوائم قراءتكِ الخاصة</span>
            </h2>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-300">إنشاء مجموعة جديدة (مثل: كتب Agatha Christie، روايات الصيف...):</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اسم المجموعة الجديدة..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!newCollectionName.trim()) return;
                  setCustomCollections([...customCollections, { id: Date.now(), name: newCollectionName.trim(), booksList: [] }]);
                  setNewCollectionName("");
                }}
                style={{ backgroundColor: currentThemeObj.color }}
                className="text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
              >
                إضافة المجموعة
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customCollections.map((col) => {
              const bookCount = col.booksList?.length || 0;
              const previewBooks = (col.booksList || []).slice(0, 2);

              return (
                <div 
                  key={col.id} 
                  onClick={() => setOpenedCollection(col)}
                  className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl space-y-3 shadow-lg flex flex-col justify-between cursor-pointer hover:border-purple-800 transition"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-purple-400" />
                        <span>{col.name}</span>
                      </h4>
                      <span className="text-[10px] bg-purple-950 border border-purple-800 text-purple-200 px-2 py-0.5 rounded-md font-bold">
                        {bookCount} كتب
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                      {previewBooks.map((bk, i) => (
                        <div key={i} className="text-xs text-zinc-300 bg-black/50 p-2 rounded-xl border border-zinc-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          <span className="truncate">{bk.title}</span>
                        </div>
                      ))}
                      {bookCount > 2 && (
                        <p className="text-[10px] text-zinc-500 text-left font-bold pt-1">+ {bookCount - 2} كتب أخرى داخل المجموعة...</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setAddingToCollectionId(col.id); }}
                    className="w-full text-xs text-purple-300 bg-purple-950/40 border border-purple-800/60 py-2 rounded-xl hover:bg-purple-900/60 transition cursor-pointer flex items-center justify-center gap-1 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة كتب لهذه المجموعة</span>
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* 🤝 سجّل الإعارة */}
      {activeMainPage === "lending" && (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
              <Users className="w-6 h-6" />
              <span>سجل إعارة الكتب لمتابعة من استعار كتبكِ</span>
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-zinc-600" />
              <input
                type="text"
                placeholder="ابحثي عن اسم مستعير أو كتاب..."
                value={lendingSearchQuery}
                onChange={(e) => setLendingSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-zinc-200"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-zinc-300">تسجيل أو تعديل إعارة كتاب للصديقة:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">اسم المستعير / الصديقة *</label>
                <input
                  type="text"
                  placeholder="مثلاً: إسراء"
                  value={newLending.borrowerName}
                  onChange={(e) => setNewLending({ ...newLending, borrowerName: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">اسم الكتاب المُعار *</label>
                <input
                  type="text"
                  placeholder="مثلاً: القربان"
                  value={newLending.bookTitleInput}
                  onChange={(e) => setNewLending({ ...newLending, bookTitleInput: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">تاريخ الإعارة (اختياري)</label>
                <input
                  type="date"
                  value={newLending.lendDate}
                  onChange={(e) => setNewLending({ ...newLending, lendDate: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">تاريخ الإرجاع المتوقع (اختياري)</label>
                <input
                  type="date"
                  value={newLending.expectedReturnDate}
                  onChange={(e) => setNewLending({ ...newLending, expectedReturnDate: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            </div>

            <div className="flex gap-3 items-center pt-2">
              <select
                value={newLending.status}
                onChange={(e) => setNewLending({ ...newLending, status: e.target.value })}
                className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
              >
                <option value="borrowed">الحالة المبدئية: قيد الإعارة ⏳</option>
                <option value="returned">الحالة المبدئية: تم الاسترجاع ✓</option>
              </select>

              <button
                onClick={() => {
                  if (!newLending.borrowerName || !newLending.bookTitleInput) return alert("أدخلي البيانات كاملة");
                  if (editingLendingId) {
                    setLendingList(lendingList.map(l => l.id === editingLendingId ? { ...l, borrowerName: newLending.borrowerName, bookTitle: newLending.bookTitleInput, lendDate: newLending.lendDate, expectedReturnDate: newLending.expectedReturnDate, isReturned: newLending.status === "returned" } : l));
                    setEditingLendingId(null);
                  } else {
                    setLendingList([...lendingList, { id: Date.now(), borrowerName: newLending.borrowerName, bookTitle: newLending.bookTitleInput, lendDate: newLending.lendDate || new Date().toISOString().split('T')[0], expectedReturnDate: newLending.expectedReturnDate, isReturned: newLending.status === "returned" }]);
                  }
                  setNewLending({ borrowerName: "", bookTitleInput: "", lendDate: "", expectedReturnDate: "", status: "borrowed" });
                }}
                style={{ backgroundColor: currentThemeObj.color }}
                className="flex-1 text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer"
              >
                {editingLendingId ? "حفظ التعديل" : "تسجيل الإعارة"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLendingList.map((item) => {
              const statusObj = getLendingStatusObj(item);

              return (
                <div key={item.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between text-xs text-zinc-300">
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm">الكتاب: {item.bookTitle}</p>
                    <p className="text-[11px] text-zinc-400">
                      المستعير: <strong className="text-purple-300">{item.borrowerName}</strong> {item.lendDate && `| تاريخ الإعارة: ${item.lendDate}`} {item.expectedReturnDate && `| الإرجاع المتوقع: ${item.expectedReturnDate}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingLendingId(item.id);
                        setNewLending({ borrowerName: item.borrowerName, bookTitleInput: item.bookTitle, lendDate: item.lendDate || "", expectedReturnDate: item.expectedReturnDate || "", status: item.isReturned ? "returned" : "borrowed" });
                      }}
                      className="p-2 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded-xl cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => setLendingList(lendingList.map(l => l.id === item.id ? { ...l, isReturned: !l.isReturned } : l))}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${statusObj.style}`}
                    >
                      {statusObj.label}
                    </button>

                    <button 
                      onClick={() => setLendingList(lendingList.filter(l => l.id !== item.id))} 
                      className="p-2 text-zinc-500 hover:text-red-400 bg-zinc-900 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ⏸️ الأرشيف */}
      {activeMainPage === "archive" && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-zinc-900 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
              <Archive className="w-6 h-6" />
              <span>الكتب المتوقفة والتي تخليتِ عن قراءتها مؤقتاً ({droppedBooks.length})</span>
            </h2>

            <button
              onClick={() => setAddDroppedModalOpen(true)}
              style={{ backgroundColor: currentThemeObj.color }}
              className="text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-md cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب متوقف</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {droppedBooks.map((b) => (
              <div key={b.id} onClick={() => openBookDetails(b)} className="bg-zinc-950 border border-zinc-900 p-3 rounded-2xl cursor-pointer hover:border-red-900 transition">
                <img src={b.cover} alt="" className="w-full aspect-[2/3] object-cover rounded-xl mb-2" />
                <h4 className="font-bold text-xs text-white line-clamp-1">{b.title}</h4>
                <p className="text-[10px] text-zinc-500">{b.author}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ⚙️ الإعدادات */}
      {activeMainPage === "settings" && (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
          <div className="border-b border-zinc-900 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
              <Settings className="w-6 h-6" />
              <span>مركز الإعدادات والشخصنة والتنبيهات المتقدم</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">التحكم الكامل بخانات إدخال الكتاب واللغات ومفاتيح التشغيل الحديثة</p>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>إعدادات نموذج إدخال الكتاب (مفاتيح تشغيل وإيقاف الخانات)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-900 text-xs text-zinc-300">
                {[
                  { key: "price", label: "السعر ومكان الشراء" },
                  { key: "purchaseNotes", label: "ملاحظات ذكريات يوم الشراء" },
                  { key: "pdfUpload", label: "إرفاق ملف PDF" },
                  { key: "series", label: "خيارات السلسلة والجزء" },
                ].map((item) => {
                  const isChecked = settings.fields[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => setSettings({
                        ...settings,
                        fields: { ...settings.fields, [item.key]: !isChecked }
                      })}
                      className="flex items-center justify-between bg-black/50 p-3 rounded-2xl border border-zinc-800 cursor-pointer hover:border-zinc-700 transition"
                    >
                      <span>{item.label}</span>
                      <div className={`p-1 rounded-full transition ${isChecked ? "text-purple-400" : "text-zinc-600"}`}>
                        {isChecked ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>إعدادات اللغة الممتدة (15 لغة) وتنسيق الوقت</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">اللغة المفضلة للتطبيق</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-2.5 text-zinc-200 outline-none cursor-pointer"
                  >
                    {languagesList.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>

                  {settings.language === "custom" && (
                    <input
                      type="text"
                      placeholder="أدخلي اسم اللغة الخاصة بكِ..."
                      value={settings.customLanguageName}
                      onChange={(e) => setSettings({ ...settings, customLanguageName: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">تنسيق الوقت والتاريخ</label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-2.5 text-zinc-200 outline-none cursor-pointer"
                  >
                    <option value="12h">نظام 12 ساعة (ص/م)</option>
                    <option value="24h">نظام 24 ساعة</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 👤 الملف الشخصي */}
      {activeMainPage === "profile" && (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300 text-center">
          <div className="bg-zinc-950 border border-purple-900/40 p-8 rounded-3xl space-y-4 shadow-2xl">
            <div className="w-20 h-20 bg-purple-950 border-2 border-purple-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-purple-200">
              A
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">مرحباً بكِ آية 👋</h2>
              <p className="text-xs text-zinc-400 mt-1">Cozy Nook - ملاذكِ الدافي والمفضل مع الكتب والقهوة</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900 text-xs">
              <div className="bg-black/50 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block">إجمالي الكتب</span>
                <strong className="text-white text-base">{totalBooks}</strong>
              </div>
              <div className="bg-black/50 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block">كتب مكتملة</span>
                <strong className="text-emerald-400 text-base">{finishedBooks}</strong>
              </div>
              <div className="bg-black/50 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block">الملاحظات</span>
                <strong className="text-purple-300 text-base">{allNotesList.length}</strong>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 📬 تواصل معنا */}
      {activeMainPage === "contact" && (
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300 text-center">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-5 shadow-2xl">
            <div className="w-14 h-14 bg-purple-950/60 border border-purple-800/80 rounded-2xl text-purple-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">تواصل معنا والدعم الفني</h2>
              <p className="text-xs text-zinc-400 mt-1">نحن هنا دائماً لسماع اقتراحاتكِ وتطوير التطبيق لخدمتكِ بأفضل شكل!</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("تم إرسال رسالتكِ بنجاح! شكرًا لكِ ❤️"); }} className="space-y-3 text-right">
              <input type="text" required placeholder="اسمكِ الكريم" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200" />
              <textarea rows={3} required placeholder="اكتبي اقتراحاتكِ أو استفساركِ هنا..." className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-xs text-zinc-200 resize-none"></textarea>
              <button type="submit" style={{ backgroundColor: currentThemeObj.color }} className="w-full text-white font-bold py-3 rounded-xl text-xs shadow-lg cursor-pointer">
                إرسال الرسالة 🚀
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 🔴 Modal - تفاصيل مجموعة مخصصة */}
      {openedCollection && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[70] flex flex-col p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-6 h-6 text-purple-400" />
                  <span>مجموعة: {openedCollection.name}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{openedCollection.description || "تضم كتب هذه القائمة الفردية"}</p>
              </div>
              <button onClick={() => setOpenedCollection(null)} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl cursor-pointer"><X className="w-6 h-6" /></button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {openedCollection.booksList?.map((bk, idx) => (
                <div key={idx} onClick={() => openBookDetails(bk)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl text-center space-y-2 cursor-pointer hover:border-purple-800 transition">
                  <img src={bk.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"} alt="" className="w-full aspect-[2/3] object-cover rounded-xl" />
                  <h4 className="font-bold text-xs text-white line-clamp-1">{bk.title}</h4>
                  <p className="text-[10px] text-zinc-500">{bk.author || "كاتب"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Modal - عرض ملاحظة مكبرة */}
      {focusedNotePopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[85] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-purple-800/80 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl space-y-4 text-center">
            <button onClick={() => setFocusedNotePopup(null)} className="absolute top-4 left-4 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>

            <div className="w-12 h-12 bg-purple-950/60 border border-purple-800 rounded-2xl text-purple-400 flex items-center justify-center mx-auto">
              <StickyNote className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-purple-300">ملاحظة / اقتباس محدد</h3>

            <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800 text-right space-y-3">
              <p className="text-base text-zinc-100 leading-relaxed font-serif italic">"{focusedNotePopup.content}"</p>
              {focusedNotePopup.page_number && (
                <span className="text-xs text-purple-400 block font-bold">صفحة {focusedNotePopup.page_number}</span>
              )}
            </div>

            <button onClick={() => setFocusedNotePopup(null)} className="w-full bg-purple-900 hover:bg-purple-800 text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* 🔴 Modal - نافذة إضافة كتاب شراء أو رغبة */}
      {addShoppingBookModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{shoppingModalType === "wishlist" ? "إضافة كتاب لقائمة الرغبات" : "إضافة كتاب مشتريات"}</span>
              </h3>
              <button onClick={() => setAddShoppingBookModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveShoppingBook} className="space-y-3">
              <input 
                type="text" 
                required 
                placeholder="عنوان الكتاب..." 
                value={shoppingBookForm.title} 
                onChange={(e) => setShoppingBookForm({ ...shoppingBookForm, title: e.target.value })} 
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none" 
              />
              <input 
                type="text" 
                required 
                placeholder="اسم المؤلف..." 
                value={shoppingBookForm.author} 
                onChange={(e) => setShoppingBookForm({ ...shoppingBookForm, author: e.target.value })} 
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none" 
              />
              
              {shoppingModalType === "purchased" && (
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="السعر (ج.م)..." value={shoppingBookForm.price} onChange={(e) => setShoppingBookForm({ ...shoppingBookForm, price: e.target.value })} className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none" />
                  <input type="text" placeholder="مكان الشراء..." value={shoppingBookForm.location} onChange={(e) => setShoppingBookForm({ ...shoppingBookForm, location: e.target.value })} className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none" />
                </div>
              )}

              <button type="submit" style={{ backgroundColor: currentThemeObj.color }} className="w-full text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">
                حفظ الكتاب
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 Modal - نافذة إضافة ملاحظة عامة */}
      {generalNoteModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-purple-400" />
                <span>إضافة ملاحظة جديدة</span>
              </h3>
              <button onClick={() => setGeneralNoteModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddGeneralNote} className="space-y-3">
              <select required value={generalNoteData.bookId} onChange={(e) => setGeneralNoteModalData({ ...generalNoteData, bookId: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200">
                <option value="">اختر الكتاب الخاص بالملاحظة...</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>

              <textarea rows={3} required placeholder="نص الاقتباس أو الملاحظة..." value={generalNoteData.content} onChange={(e) => setGeneralNoteModalData({ ...generalNoteData, content: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 resize-none"></textarea>

              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="الفصل (اختياري)" value={generalNoteData.chapter} onChange={(e) => setGeneralNoteModalData({ ...generalNoteData, chapter: e.target.value })} className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200" />
                <input type="number" placeholder="رقم الصفحة (اختياري)" value={generalNoteData.page} onChange={(e) => setGeneralNoteModalData({ ...generalNoteData, page: e.target.value })} className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200" />
              </div>

              <button type="submit" style={{ backgroundColor: currentThemeObj.color }} className="w-full text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">
                حفظ الملاحظة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 Modal - نافذة إضافة كتاب لمجموعة مخصصة */}
      {addingToCollectionId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-purple-400" />
                <span>إضافة كتاب لهذه المجموعة</span>
              </h3>
              <button onClick={() => setAddingToCollectionId(null)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddBookToCollection} className="space-y-4">
              <div className="flex gap-2 border-b border-zinc-900 pb-2 text-xs">
                <button type="button" onClick={() => setCollectionAddMode("existing")} className={`px-2.5 py-1 rounded-lg ${collectionAddMode === "existing" ? "bg-purple-950 text-purple-200 border border-purple-800" : "text-zinc-500"}`}>من المشتريات 📚</button>
                <button type="button" onClick={() => setCollectionAddMode("wishlist")} className={`px-2.5 py-1 rounded-lg ${collectionAddMode === "wishlist" ? "bg-purple-950 text-purple-200 border border-purple-800" : "text-zinc-500"}`}>من الأمنيّات 🔖</button>
                <button type="button" onClick={() => setCollectionAddMode("manual")} className={`px-2.5 py-1 rounded-lg ${collectionAddMode === "manual" ? "bg-purple-950 text-purple-200 border border-purple-800" : "text-zinc-500"}`}>إدخال يدوياً ✍️</button>
              </div>

              {collectionAddMode === "existing" && (
                <select value={selectedBookForCollection} onChange={(e) => setSelectedBookForCollection(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200">
                  <option value="">اختر الكتاب من كتبكِ المشتراة...</option>
                  {purchasedBooksList.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              )}

              {collectionAddMode === "wishlist" && (
                <select value={selectedBookForCollection} onChange={(e) => setSelectedBookForCollection(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200">
                  <option value="">اختر الكتاب من قائمة الأمنيات...</option>
                  {wishlistBooksList.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              )}

              {collectionAddMode === "manual" && (
                <div className="space-y-2">
                  <input type="text" placeholder="عنوان الكتاب..." value={manualCollectionBook.title} onChange={(e) => setManualCollectionBook({ ...manualCollectionBook, title: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200" />
                  <input type="text" placeholder="اسم المؤلف..." value={manualCollectionBook.author} onChange={(e) => setManualCollectionBook({ ...manualCollectionBook, author: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200" />
                </div>
              )}

              <button type="submit" style={{ backgroundColor: currentThemeObj.color }} className="w-full text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer">
                إضافة للمجموعة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 Modal - نافذة إضافة كتاب متوقف للأرشيف */}
      {addDroppedModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Archive className="w-4 h-4 text-red-400" />
                <span>إضافة كتاب لأرشيف المتوقف</span>
              </h3>
              <button onClick={() => setAddDroppedModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <select value={selectedDroppedBookId} onChange={(e) => setSelectedDroppedBookId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200">
                <option value="">اختر الكتاب الذي توقفتِ عنه...</option>
                {books.filter(b => b.status !== "dropped").map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>

              <button onClick={handleAddDroppedBook} className="w-full bg-red-950 hover:bg-red-900 text-red-100 border border-red-800 text-xs py-2.5 rounded-xl font-bold cursor-pointer">
                تحويل لمتوقف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Modal (z-[99]) - المؤقت القاطع للمشتتات في نص الشاشة بالضبط */}
      {activeTimerBook && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[99] flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="bg-gradient-to-b from-zinc-950 via-purple-950/40 to-black border-2 border-purple-800/80 rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <span className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs px-4 py-1.5 rounded-full font-bold">
              <Clock className="w-4 h-4 animate-spin text-purple-400" />
              <span>جلسة قراءة نشطة ⏱️</span>
            </span>

            <div className="flex flex-col items-center gap-3">
              <img src={activeTimerBook.cover} alt={activeTimerBook.title} className="w-24 h-36 object-cover rounded-2xl shadow-2xl border border-zinc-800" />
              <div>
                <h3 className="text-lg font-extrabold text-white line-clamp-1">{activeTimerBook.title}</h3>
                <p className="text-xs text-zinc-400">{activeTimerBook.author}</p>
              </div>
            </div>

            <div className="bg-black/60 border border-zinc-800/80 p-5 rounded-3xl space-y-1">
              <p className="text-5xl font-mono font-black text-white tracking-widest drop-shadow-lg">
                {formatTimerTime(timerSeconds)}
              </p>
              <p className="text-[11px] text-zinc-500">المؤقت يحسب دقائق تركيزكِ الآن...</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-2xl border transition cursor-pointer shadow-lg ${
                  isTimerRunning ? "bg-amber-950 border-amber-800 text-amber-300" : "bg-emerald-950 border-emerald-800 text-emerald-300"
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? "إيقاف مؤقت" : "استئناف"}</span>
              </button>

              <button
                onClick={stopBookTimerAndPrompt}
                className="flex-[1.5] bg-purple-900 hover:bg-purple-800 text-white text-xs py-3 px-4 rounded-2xl font-bold shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current text-white" />
                <span>إنهاء وقوف القراءة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Modal (z-[60]) - نافذة التحديث السريع للصفحات المقروءة */}
      {quickProgressBook && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>تحديث تقدم القراءة</span>
              </h3>
              <button onClick={() => setQuickProgressBook(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              كتاب: <strong className="text-white">{quickProgressBook.title}</strong>
              <br />
              كنتِ عند صفحة <span className="text-emerald-400 font-bold">{quickProgressBook.progress || 0}</span> من أصل <span className="text-zinc-200 font-bold">{quickProgressBook.totalPages || 0}</span>.
            </p>

            <form onSubmit={handleQuickProgressUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">وصلتِ لصفحة كام دلوقتي؟</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={quickProgressBook.totalPages || 9999}
                  placeholder="أدخلي رقم الصفحة الجديدة..."
                  value={quickProgressInput}
                  onChange={(e) => setQuickProgressInput(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setQuickProgressBook(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingProgress}
                  className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingProgress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>تحديث الصفحات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 Modal (z-[80]) - كارت التقرير والتوصية الذكية بعد الجلسة */}
      {sessionReport && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-purple-900/80 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5 text-center">
            <button onClick={() => setQuoteSessionReport(null)} className="absolute top-4 left-4 text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-purple-950/60 border border-purple-800/80 rounded-2xl text-purple-400 flex items-center justify-center mx-auto">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">تقرير الجلسة والتوصية الذكية 🎉</h3>
              <p className="text-xs text-zinc-400">كتاب: <strong className="text-purple-300">{sessionReport.bookTitle}</strong></p>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-300 space-y-2 text-right">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>⏱️ الوقت المستغرق:</span>
                <strong className="text-white">{sessionReport.elapsedMinutes} دقيقة</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>📖 الصفحات المقروءة:</span>
                <strong className="text-emerald-400">{sessionReport.addedPages} صفحة (وصلتِ لصـ {sessionReport.newProgressVal})</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>📈 نسبة الإنجاز في الجلسة:</span>
                <strong className="text-purple-300">+{sessionReport.progressGainPercent}% (الإجمالي: {sessionReport.totalProgressPercent}%)</strong>
              </div>
              <div className="flex justify-between">
                <span>⚡ متوسط السرعة:</span>
                <strong className="text-amber-400">{sessionReport.timePerPage} دقيقة لكل صفحة</strong>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-950/60 to-black p-4 rounded-2xl border border-purple-800/40 text-right space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>اقتراح جلسة القراءة القادمة:</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                بناءً على سرعتكِ الجيدة، نقترح في جلستكِ القادمة أن تقرأي <strong className="text-amber-300">{sessionReport.suggestedNextPages} صفحة</strong> خلال حوالي <strong className="text-amber-300">{sessionReport.suggestedNextTime} دقيقة</strong>!
              </p>
            </div>

            <button
              onClick={() => setQuoteSessionReport(null)}
              className="w-full bg-purple-900 hover:bg-purple-800 text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer"
            >
              حسناً، رائع جداً! 👍
            </button>
          </div>
        </div>
      )}

      {/* Modal - تغيير الحالة السريع */}
      {quickStatusBook && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                <span>تغيير حالة الكتاب</span>
              </h3>
              <button onClick={() => setQuickStatusBook(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              اختر الحالة الجديدة لكتاب: <strong className="text-white">{quickStatusBook.title}</strong>
            </p>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "reading", label: "أقرؤه الآن 📖", desc: "ينتقل إلى قائمة القراءة الحالية" },
                { id: "finished", label: "مكتمل (أنهيت قراءته) 🎉", desc: "يُحدّث الصفحات المقروءة إلى 100% تلقائياً" },
                { id: "want_to_read", label: "أقرأه لاحقاً 🔖", desc: "يُحفظ في قائمة القراءة المستقبلية" },
                { id: "dropped", label: "متوقف (لم يعجبني) ⏸️", desc: "إيقاف الكتاب مؤقتاً" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleQuickStatusUpdate(st.id)}
                  disabled={isUpdatingStatus}
                  className={`text-right p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-0.5 ${
                    quickStatusBook.status === st.id
                      ? "bg-purple-950/80 border-purple-800 text-purple-200"
                      : "bg-black/50 border-zinc-800/80 hover:bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <span className="text-xs font-bold">{st.label}</span>
                  <span className="text-[10px] text-zinc-500">{st.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🎨 Modal - إضافة أو تعديل كتاب مع ميزة البحث الذكي لـ Google Books API (مثل Bookmory) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-3xl w-full max-w-xl p-6 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto`}>
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
                {editingBookId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{editingBookId ? "تعديل بيانات الكتاب" : "إضافة كتاب جديد لمكتبتكِ"}</span>
              </h2>
              <button 
                onClick={() => { resetForm(); setIsModalOpen(false); }}
                className="text-zinc-500 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 🔍 محرك بحث Google Books الآلي (ميزة Bookmory) */}
            {!editingBookId && (
              <div className="bg-gradient-to-r from-purple-950/60 via-black to-zinc-950 border border-purple-800/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>البحث الذكي عن أي كتاب (مثل Bookmory) لملء البيانات تلقائياً:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="اكتبي اسم الكتاب أو المؤلف (عربي / إنجليزي)..."
                    value={apiSearchQuery}
                    onChange={(e) => setApiSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchGoogleBooksAPI(apiSearchQuery);
                      }
                    }}
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none focus:border-purple-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => searchGoogleBooksAPI(apiSearchQuery)} 
                    style={{ backgroundColor: currentThemeObj.color }} 
                    className="text-white text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSearchingApi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>بحث أوتوماتيك</span>
                  </button>
                </div>

                {isSearchingApi && (
                  <p className="text-xs text-purple-300 flex items-center gap-2 pt-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الاتصال بـ Google Books لجلب كتابكِ...</span>
                  </p>
                )}

                {hasSearched && !isSearchingApi && apiSearchResults.length === 0 && (
                  <p className="text-xs text-amber-400 pt-1">
                    لم نجد نتائج مطابقة، يمكنكِ كتابة البيانات يدوياً بالأسفل 👇
                  </p>
                )}

                {apiSearchResults.length > 0 && (
                  <div className="space-y-2 pt-2 max-h-48 overflow-y-auto border-t border-zinc-900">
                    <p className="text-[10px] text-zinc-400">انقري على الكتاب لتعبئة بياناته بالكامل تلقائياً:</p>
                    {apiSearchResults.map((item) => {
                      const info = item.volumeInfo || {};
                      const thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";
                      return (
                        <div key={item.id} onClick={() => handleSelectGoogleBook(item)} className="bg-zinc-900 hover:bg-purple-950/60 border border-zinc-800 p-2 rounded-xl flex items-center gap-3 cursor-pointer transition">
                          <img src={thumb.replace("http://", "https://")} alt="" className="w-8 h-12 object-cover rounded-lg" />
                          <div className="text-right">
                            <h5 className="font-bold text-xs text-white line-clamp-1">{info.title}</h5>
                            <p className="text-[10px] text-zinc-400">{info.authors ? (Array.isArray(info.authors) ? info.authors.join(", ") : info.authors) : "مؤلف"} {info.pageCount && `| ${info.pageCount} صفحة`}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-6">
              
              {/* قسم 1: المعلومات الأساسية */}
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 pb-1 border-b border-zinc-900">
                  <span>📌 1. المعلومات الأساسية</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">عنوان الكتاب *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: القربان"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">اسم الكاتب/المؤلف *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: مروة گوهر"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-600 transition"
                    />
                  </div>
                </div>
              </div>

              {/* قسم 2: التصنيفات والسلسلة */}
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 pb-1 border-b border-zinc-900">
                  <span>🏷️ 2. التصنيف والسلسلة</span>
                </h3>

                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-400">اختر التصنيفات المناسبة لكتابكِ:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCategories.map((cat) => {
                      const isSelected = selectedCategoriesList.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategorySelection(cat)}
                          style={{
                            backgroundColor: isSelected ? currentThemeObj.color : "transparent",
                            borderColor: isSelected ? currentThemeObj.color : "#27272a"
                          }}
                          className={`text-[11px] px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                            isSelected ? "text-white font-bold shadow-md" : "text-zinc-400 bg-black/60 hover:text-white"
                          }`}
                        >
                          {cat} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {settings.fields.series && (
                  <div className="pt-2 border-t border-zinc-900/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-purple-300 flex items-center gap-1.5 font-bold cursor-pointer">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>هل هذا الكتاب جزء من سلسلة؟</span>
                      </label>
                      <input
                        type="checkbox"
                        id="isSeriesCheck"
                        checked={newBook.is_series}
                        onChange={(e) => setNewBook({ ...newBook, is_series: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-800 bg-black text-purple-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    {newBook.is_series && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <input
                          type="text"
                          placeholder="اسم السلسلة"
                          value={newBook.series_name}
                          onChange={(e) => setNewBook({ ...newBook, series_name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="رقم الجزء"
                          value={newBook.part_number}
                          onChange={(e) => setNewBook({ ...newBook, part_number: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* قسم 3: حالة القراءة والتقدم والتقييم */}
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 pb-1 border-b border-zinc-900">
                  <span>📖 3. الحالة والتقدم</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">حالة القراءة الحالي</label>
                    <select
                      value={newBook.status}
                      onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none cursor-pointer"
                    >
                      <option value="reading">أقرؤه الآن</option>
                      <option value="finished">مكتمل</option>
                      <option value="want_to_read">أقرأه لاحقاً</option>
                      <option value="dropped">متوقف (لم يعجبني)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">تقييمك الشخصي (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newBook.rating}
                      onChange={(e) => setNewBook({ ...newBook, rating: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">الصفحات المقروءة</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newBook.progress}
                      onChange={(e) => setNewBook({ ...newBook, progress: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">إجمالي الصفحات</label>
                    <input
                      type="number"
                      placeholder="300"
                      value={newBook.totalPages}
                      onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* قسم 4: سجل الشراء الممتلكات */}
              {settings.fields.price && (
                <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>سجل المشتريات (Wishlist / Purchase)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPurchasedCheck"
                        checked={newBook.is_purchased}
                        onChange={(e) => setNewBook({ ...newBook, is_purchased: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-800 bg-black text-purple-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="isPurchasedCheck" className="text-xs text-zinc-300 cursor-pointer">
                        تم شراء هذا الكتاب 🛒
                      </label>
                    </div>
                  </div>

                  {newBook.is_purchased && (
                    <div className="space-y-3 pt-2 border-t border-zinc-900/80">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="number"
                          placeholder="السعر (ج.م)"
                          value={newBook.price}
                          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                          className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="مكان الشراء"
                          value={newBook.purchase_location}
                          onChange={(e) => setNewBook({ ...newBook, purchase_location: e.target.value })}
                          className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={newBook.purchase_date}
                          onChange={(e) => setNewBook({ ...newBook, purchase_date: e.target.value })}
                          className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* قسم 5: غلاف وملف الكتاب */}
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400">صورة الغلاف والملفات</label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCoverSource("url")}
                      style={{ backgroundColor: coverSource === "url" ? currentThemeObj.color : "transparent" }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-800 text-white transition cursor-pointer"
                    >
                      <LinkIcon className="w-3 h-3" /> رابط URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSource("file")}
                      style={{ backgroundColor: coverSource === "file" ? currentThemeObj.color : "transparent" }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-800 text-white transition cursor-pointer"
                    >
                      <Upload className="w-3 h-3" /> رفع صورة
                    </button>
                  </div>
                </div>

                {coverSource === "url" ? (
                  <input
                    type="text"
                    placeholder="رابط صورة الغلاف (URL)..."
                    value={newBook.cover}
                    onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedCoverFile(e.target.files[0])}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200"
                  />
                )}

                {settings.fields.pdfUpload && (
                  <div className="pt-2 border-t border-zinc-900">
                    <label className="block text-[11px] text-zinc-400 mb-1">إرفاق ملف الكتاب (PDF - اختياري)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedPdfFile(e.target.files[0])}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 file:mr-4 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-zinc-800 file:text-zinc-200"
                    />
                  </div>
                )}
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="pt-3 flex justify-end gap-3 border-t border-zinc-900 sticky bottom-0 bg-zinc-950 py-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsModalOpen(false); }}
                  className="px-5 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: currentThemeObj.color }}
                  className="text-white font-bold px-6 py-2.5 rounded-xl text-xs transition border border-white/10 flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingBookId ? "حفظ التعديلات" : "حفظ الكتاب"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* الصفحة الممتدة الفاخرة لتفاصيل الكتاب */}
      {selectedBookDetails && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex flex-col overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-black/90 border-b border-zinc-800/80 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md">
            <button
              onClick={closeBookDetails}
              className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              <ArrowRight className="w-4 h-4 text-purple-400" />
              <span>الرجوع للمكتبة الرئيسية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const bookToEdit = selectedBookDetails;
                  closeBookDetails();
                  handleOpenEditModal(bookToEdit);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                <span>تعديل الكتاب</span>
              </button>

              <button
                onClick={() => {
                  const bookToDelete = selectedBookDetails;
                  triggerDeleteModal(bookToDelete);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/40 hover:bg-red-950/80 border border-red-900/50 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الكتاب</span>
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="space-y-4 text-center ">
                <div className="relative group">
                  <img
                    src={selectedBookDetails.cover}
                    alt={selectedBookDetails.title}
                    className="w-full max-w-xs mx-auto aspect-[2/3] object-cover rounded-3xl shadow-2xl border border-zinc-800 group-hover:scale-102 transition duration-500"
                  />
                </div>

                {selectedBookDetails.pdf_url && (
                  <button
                    onClick={() => openPdfViewer(selectedBookDetails.pdf_url, selectedBookDetails.title)}
                    style={{ backgroundColor: currentThemeObj.color }}
                    className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-bold shadow-xl transition cursor-pointer text-sm hover:opacity-90"
                  >
                    <FileText className="w-4 h-4" />
                    <span>قراءة ملف PDF المدمج 📖</span>
                  </button>
                )}
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {(selectedBookDetails.categories && selectedBookDetails.categories.length > 0 
                      ? selectedBookDetails.categories 
                      : [selectedBookDetails.category || "روايات"]
                    ).map((cat, idx) => (
                      <span key={idx} className="text-white text-xs px-3.5 py-1 rounded-full font-bold shadow-md" style={{ backgroundColor: currentThemeObj.color }}>
                        {cat}
                      </span>
                    ))}

                    {selectedBookDetails.series_name && (
                      <span className="bg-purple-950 border border-purple-800 text-purple-200 text-xs px-3.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>سلسلة: {selectedBookDetails.series_name} {selectedBookDetails.part_number && `(الجزء ${selectedBookDetails.part_number})`}</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{selectedBookDetails.title}</h1>
                  <p className="text-zinc-400 text-sm sm:text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>اسم المؤلف: <strong className="text-zinc-200">{selectedBookDetails.author}</strong></span>
                  </p>
                </div>

                {/* أزرار الإجراءات السريعة والمؤقت */}
                <div className="flex flex-wrap items-center gap-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-900">
                  {(!activeTimerBook || activeTimerBook.id !== selectedBookDetails.id) && (
                    <button
                      onClick={() => startBookTimer(selectedBookDetails)}
                      className="flex items-center gap-2 text-xs font-bold text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-800/80 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md"
                    >
                      <Play className="w-4 h-4 text-purple-400 fill-current" />
                      <span>بدء مؤقت القراءة لهذا الكتاب ⏱️</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setQuickProgressBook(selectedBookDetails);
                      setQuickProgressInput(selectedBookDetails.progress || "");
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/80 px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>تحديث الصفحة مباشرة</span>
                  </button>

                  <button
                    onClick={() => setQuickStatusBook(selectedBookDetails)}
                    className="flex items-center gap-2 text-xs font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                    <span>تغيير الحالة: {getStatusLabel(selectedBookDetails.status)}</span>
                  </button>
                </div>

                {/* أجزاء نفس السلسلة إن وجدت */}
                {seriesRelatedBooks.length > 0 && (
                  <div className="bg-purple-950/20 border border-purple-900/40 p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>أجزاء أخرى من هذه السلسلة ({selectedBookDetails.series_name}):</span>
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {seriesRelatedBooks.map((relBook) => (
                        <div
                          key={relBook.id}
                          onClick={() => openBookDetails(relBook)}
                          className="bg-black/60 border border-zinc-800 p-2 rounded-xl flex items-center gap-2.5 cursor-pointer hover:border-purple-800 transition shrink-0"
                        >
                          <img src={relBook.cover} alt={relBook.title} className="w-10 h-14 object-cover rounded-lg" />
                          <div className="text-right">
                            <p className="text-xs font-bold text-white line-clamp-1">{relBook.title}</p>
                            <p className="text-[10px] text-purple-400 font-bold">
                              {relBook.part_number ? `الجزء ${relBook.part_number}` : "جزء آخر"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
                  <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[11px]">التقييم الشخصي</span>
                    <div className="flex items-center gap-1 font-black text-amber-400 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{selectedBookDetails.rating} / 5</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[11px]">حالة القراءة</span>
                    <span className="font-bold text-white text-sm">{getStatusLabel(selectedBookDetails.status)}</span>
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1 bg-black/40 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[11px]">حالة الملكية</span>
                    <span className={`font-bold text-xs ${selectedBookDetails.is_purchased ? "text-emerald-400" : "text-amber-400"}`}>
                      {selectedBookDetails.is_purchased ? "ممتلك (تم شراؤه) 🛒" : "قائمة رغبات الشراء (Wishlist)"}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-2.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>تقدم الصفحات المقروءة</span>
                    <span className="font-bold text-white">
                      ص {selectedBookDetails.progress || 0} / {selectedBookDetails.totalPages || 0} (
                      {selectedBookDetails.totalPages > 0 
                        ? Math.round((selectedBookDetails.progress / selectedBookDetails.totalPages) * 100) 
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: currentThemeObj.color,
                        width: `${selectedBookDetails.totalPages > 0 ? (selectedBookDetails.progress / selectedBookDetails.totalPages) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                {selectedBookDetails.is_purchased && (
                  <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 rounded-3xl border border-amber-900/30 space-y-3">
                    <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>سجل وبيانات الشراء الذكرى:</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                      {selectedBookDetails.price && (
                        <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-zinc-800">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>السعر: <strong>{selectedBookDetails.price} ج.م</strong></span>
                        </div>
                      )}

                      {selectedBookDetails.purchase_location && (
                        <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-zinc-800">
                          <MapPin className="w-4 h-4 text-amber-400" />
                          <span>المكان: <strong>{selectedBookDetails.purchase_location}</strong></span>
                        </div>
                      )}

                      {selectedBookDetails.purchase_date && (
                        <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-zinc-800">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>التاريخ: <strong>{selectedBookDetails.purchase_date}</strong></span>
                        </div>
                      )}
                    </div>

                    {selectedBookDetails.purchase_notes && (
                      <p className="text-xs text-zinc-300 italic bg-black/40 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                        "{selectedBookDetails.purchase_notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 📝 دفتر الملاحظات */}
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: currentThemeObj.color }}>
                  <StickyNote className="w-5 h-5" />
                  <span>دفتر الملاحظات والاقتباسات الخاصة بالكتاب ({bookNotesList.length})</span>
                </h3>

                {!showAddNoteForm && (
                  <button
                    onClick={() => setShowAddNoteForm(true)}
                    style={{ backgroundColor: currentThemeObj.color }}
                    className="flex items-center gap-2 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-md cursor-pointer hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة ملاحظة أو اقتباس جديد</span>
                  </button>
                )}
              </div>

              {showAddNoteForm && (
                <form onSubmit={handleAddNote} className="bg-zinc-950 border border-purple-900/60 p-5 rounded-3xl space-y-3 shadow-xl animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xs font-bold text-purple-300">كتابة ملاحظة / اقتباس جديد</span>
                    <button type="button" onClick={() => setShowAddNoteForm(false)} className="text-zinc-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="اكتبي اقتباسكِ المفضل من هذا الكتاب، أو أفكاركِ الخاصة..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none leading-relaxed resize-none"
                  ></textarea>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="اسم/رقم الفصل (اختياري)"
                      value={newNoteChapter}
                      onChange={(e) => setNewNoteChapter(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="رقم الصفحة (اختياري)"
                      value={newNotePage}
                      onChange={(e) => setNewNotePage(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddNoteForm(false)}
                        className="flex-1 bg-zinc-900 text-zinc-400 text-xs py-2.5 rounded-xl"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingNote}
                        style={{ backgroundColor: currentThemeObj.color }}
                        className="flex-1 text-white text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>حفظ</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {loadingNotes ? (
                <div className="text-center py-6 text-xs text-zinc-500">جاري تحميل الملاحظات...</div>
              ) : bookNotesList.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-600 bg-zinc-950 rounded-2xl border border-zinc-900">
                  لا توجد ملاحظات مدونة لهذا الكتاب بعد. اضغطي زر "إضافة ملاحظة" فوق لتبدئي التدوين! 📝
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookNotesList.map((note) => (
                    <div 
                      key={note.id}
                      className={`bg-zinc-950 border ${currentThemeObj.border} rounded-2xl p-4 flex justify-between items-start gap-3 shadow-md`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          {note.chapter && (
                            <span className="text-white px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1" style={{ backgroundColor: currentThemeObj.color }}>
                              <BookmarkCheck className="w-3 h-3" />
                              <span>{note.chapter}</span>
                            </span>
                          )}
                          {note.page_number && (
                            <span className="bg-black border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                              <Hash className="w-3 h-3 text-zinc-500" />
                              <span>صفحة {note.page_number}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
                          "{note.content}"
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQuoteToShare({ book: selectedBookDetails, note })}
                          title="مشاركة كبطاقة اقتباس صورة"
                          className="text-zinc-500 hover:text-purple-400 transition p-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-zinc-600 hover:text-red-400 transition p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - بطاقة الاقتباسات للمشاركة كـ صورة */}
      {quoteToShare && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-purple-900/60 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5 text-center">
            <button onClick={() => setQuoteToShare(null)} className="absolute top-4 left-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-purple-300">بطاقة اقتباس مخصصة للمشاركة</h3>

            <div className="bg-gradient-to-br from-zinc-900 via-purple-950/40 to-black p-6 rounded-2xl border border-purple-800/40 shadow-2xl text-right space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-3">
                <img src={quoteToShare.book.cover} alt="" className="w-10 h-14 object-cover rounded-lg shadow" />
                <div>
                  <h4 className="font-bold text-xs text-white">{quoteToShare.book.title}</h4>
                  <p className="text-[11px] text-zinc-400">{quoteToShare.book.author}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed italic font-serif">
                "{quoteToShare.note.content}"
              </p>

              {quoteToShare.note.page_number && (
                <span className="text-[10px] text-purple-400 block text-left">صفحة {quoteToShare.note.page_number}</span>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  alert("يمكنكِ أخذ لقطة شاشة للبطاقة ورؤيتها في الاستوري الخاص بكِ!");
                  setQuoteToShare(null);
                }}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition cursor-pointer"
              >
                جاهزة للمشاركة 📸
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - نافذة الحذف مع التأكيد */}
      {deleteModalOpen && bookToDelete && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className={`${currentThemeObj.card} border ${currentThemeObj.border} rounded-3xl w-full max-w-md p-6 text-center space-y-5 shadow-2xl`}>
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-950/50 border border-red-900/60 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">حذف الكتاب</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                هل أنتِ متأكدة من حذف كتاب <span className="text-purple-300 font-bold">"{bookToDelete.title}"</span>؟
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setDeleteModalOpen(false); setBookToDelete(null); }}
                className="flex-1 bg-zinc-900 text-zinc-300 text-xs py-2.5 rounded-xl border border-zinc-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteBook}
                disabled={isDeleting}
                className="flex-1 bg-red-950 text-red-200 border border-red-800 text-xs py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "نعم، إحذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - عارض الـ PDF مع وضع الـ Zen */}
      {pdfModalOpen && activePdfUrl && (
        <div className={`fixed inset-0 bg-black backdrop-blur-lg z-[60] flex flex-col transition-all duration-300 ${isZenMode ? "p-0" : "p-2 sm:p-6"}`}>
          <div className={`bg-zinc-950 border border-zinc-800 rounded-3xl w-full h-full flex flex-col overflow-hidden ${isZenMode ? "rounded-none border-none" : ""}`}>
            <div className="flex justify-between items-center bg-black/90 px-6 py-3 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-zinc-200 truncate max-w-xs sm:max-w-md">
                  قراءة: {activePdfTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZenMode(!isZenMode)}
                  style={{ backgroundColor: isZenMode ? currentThemeObj.color : "transparent" }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-200 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isZenMode ? "إنهاء وضع التركيز" : "وضع التركيز (Zen)"}</span>
                </button>
                <button
                  onClick={() => { setPdfModalOpen(false); setActivePdfUrl(""); setIsZenMode(false); }}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 w-full h-full relative">
              <iframe src={activePdfUrl} title={activePdfTitle} className="w-full h-full border-none"></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;