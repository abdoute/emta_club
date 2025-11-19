(function(){
  const STORAGE_KEY = 'emta_lang';
  const DEFAULT_LANG = 'en';

  // Minimal dictionary. Extend as needed per page.
  const dict = {
    en: {
      home: 'Home',
      about: 'About',
      activities: 'Activities',
      join: 'Join Us',
      contact: 'Contact',
      dashboard: 'Dashboard',
      login: 'Login',
      welcome: 'Welcome to',
      slogan: 'Where innovation meets technology. Join us in shaping the future of science and engineering.',
      discover: 'Discover More',
      joinNow: 'Join Now',
      success_stories: 'Success Stories',
      what_members_say: 'What Our Members Say',
      our_domains: 'Our Domains',
      explore_fields: 'Explore the fields we specialize in',
      why_join_us: 'Why Join Us?',
      discover_what_special: 'Discover what makes E-MTA Club special',
      ready_to_start: 'Ready to Start Your Journey?',
      join_cta: 'Join E-MTA Club today and become part of an innovative community',
      page_not_found: 'Page Not Found',
      page_not_found_desc: "The page you're looking for doesn't exist or has been moved.",
      back_home: 'Back to Home',
      contact_us_btn: 'Contact Us',
      active_members: 'Active Members',
      workshops: 'Workshops',
      projects: 'Projects',
      competitions: 'Competitions',
      our_events: 'Our Events',
      activity_types: 'Activity Types',
      discover_offer: 'Discover what we offer',
      workshops_desc: 'Hands-on learning sessions on cutting-edge technologies',
      projects_desc: 'Innovative projects and collaborative engineering solutions',
      competitions_desc: 'Hackathons, coding challenges, and technical competitions',
      conferences: 'Conferences',
      conferences_desc: 'Scientific talks, seminars, and knowledge sharing events',
      upcoming_events: 'Upcoming Events',
      dont_miss: "Don't miss our next activities",
      past_events: 'Past Events',
      highlights: 'Highlights from our previous activities',
      event_gallery: 'Event Gallery',
      memories: 'Memories from our activities',
      contactTitle: 'Contact Us',
      activitiesTitle: 'Activities & Events',
      activitiesIntro: 'Explore our workshops, projects, competitions, and scientific events. Stay updated with our latest activities and join us!',
      joinTitle: 'Join E-MTA Club',
      joinIntro: 'Become part of our scientific community — collaborate, create and innovate together.',
      specialties_intro: 'Explore tracks from L3 to M2, including the 3‑year professional license PRE, with outcomes and careers.',
      get_in_touch: 'Get In Touch',
      contact_us: 'Contact Us',
      contact_intro: "Have questions? Want to collaborate? We're here to help! Reach out to us through any of the channels below.",
      send_message: 'Send Us a Message',
      name: 'Your Name',
      email: 'Email Address',
      phone_optional: 'Phone (Optional)',
      message: 'Message',
      subject: 'Subject',
      select_subject: 'Select a subject',
      password: 'Password',
      your_password: 'Your password',
      remember_me: 'Remember me',
      forgot_password: 'Forgot password?',
      welcome_back: 'Welcome back',
      login_to_profile: 'Login to your profile',
      new_here: 'New here?',
      create_account: 'Create an account',
      general_inquiry: 'General Inquiry',
      membership: 'Membership',
      collaboration: 'Collaboration',
      event_inquiry: 'Event Inquiry',
      other: 'Other',
      send: 'Send Message',

      specialties_title: 'Specialties of the Department of Electrotechnics and Automatics',
      overview: 'Overview',
      browse_tracks: 'Browse Tracks',
      join_now: 'Join Now',
    },
    ar: {
      home: 'الرئيسية',
      about: 'حول',
      activities: 'الأنشطة',
      join: 'انضم إلينا',
      contact: 'تواصل',
      dashboard: 'لوحة التحكم',
      login: 'تسجيل الدخول',
      welcome: 'مرحبا بك في',
      slogan: 'أين تلتقي الابتكارات بالتكنولوجيا. انضم إلينا لصناعة مستقبل العلوم والهندسة.',
      discover: 'اكتشف المزيد',
      joinNow: 'انضم الآن',
      success_stories: 'قصص نجاح',
      what_members_say: 'آراء أعضاء النادي',
      our_domains: 'مجالاتنا',
      explore_fields: 'اكتشف المجالات التي نتميز فيها',
      why_join_us: 'لماذا تنضم إلينا؟',
      discover_what_special: 'اكتشف ما يميز نادي E-MTA',
      ready_to_start: 'مستعد لبدء رحلتك؟',
      join_cta: 'انضم إلى نادي E-MTA اليوم وكن جزءاً من مجتمع مبتكر',
      page_not_found: 'الصفحة غير موجودة',
      page_not_found_desc: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      back_home: 'الرجوع إلى الرئيسية',
      contact_us_btn: 'تواصل معنا',
      active_members: 'أعضاء نشطون',
      workshops: 'ورشات',
      projects: 'مشاريع',
      competitions: 'مسابقات',
      our_events: 'فعالياتنا',
      activity_types: 'أنواع الأنشطة',
      discover_offer: 'اكتشف ما نقدمه',
      workshops_desc: 'جلسات تعلم عملية حول أحدث التقنيات',
      projects_desc: 'مشاريع مبتكرة وحلول هندسية تعاونية',
      competitions_desc: 'هاكاثونات وتحديات برمجية ومسابقات تقنية',
      conferences: 'مؤتمرات',
      conferences_desc: 'محاضرات علمية وندوات ومشاركة المعرفة',
      upcoming_events: 'الفعاليات القادمة',
      dont_miss: 'لا تفوّت نشاطاتنا القادمة',
      past_events: 'فعاليات سابقة',
      highlights: 'أبرز ما قدمناه سابقاً',
      event_gallery: 'معرض الفعاليات',
      memories: 'ذكريات من نشاطاتنا',
      contactTitle: 'اتصل بنا',
      activitiesTitle: 'الأنشطة والفعاليات',
      activitiesIntro: 'استكشف الورشات والمشاريع والمسابقات والفعاليات العلمية. ابق على اطلاع بآخر نشاطاتنا وانضم إلينا!',
      joinTitle: 'انضم إلى نادي E-MTA',
      joinIntro: 'كن جزءاً من مجتمعنا العلمي — تعاون وابتكر معنا.',
      specialties_intro: 'استكشف المسارات من السنة الثالثة ليسانس إلى الماستر، مع رخصة مهنية PRE لثلاث سنوات، ومخرجات وتخصصات.',
      get_in_touch: 'تواصل معنا',
      contact_us: 'اتصل بنا',
      contact_intro: 'عندك أسئلة؟ حاب تتعاون معنا؟ رانا هنا للمساعدة! تواصل معنا عبر القنوات أدناه.',
      send_message: 'أرسل لنا رسالة',
      name: 'اسمك',
      email: 'البريد الإلكتروني',
      phone_optional: 'الهاتف (اختياري)',
      message: 'الرسالة',
      subject: 'الموضوع',
      select_subject: 'اختر الموضوع',
      password: 'كلمة المرور',
      your_password: 'كلمة المرور الخاصة بك',
      remember_me: 'تذكرني',
      forgot_password: 'نسيت كلمة المرور؟',
      welcome_back: 'مرحباً بعودتك',
      login_to_profile: 'سجّل الدخول إلى حسابك',
      new_here: 'جديد هنا؟',
      create_account: 'أنشئ حساباً',
      general_inquiry: 'استفسار عام',
      membership: 'العضوية',
      collaboration: 'تعاون',
      event_inquiry: 'استفسار عن فعالية',
      other: 'أخرى',
      send: 'إرسال الرسالة',

      specialties_title: 'تخصصات قسم الإلكتروتقني والأتمتة',
      overview: 'نظرة عامة',
      browse_tracks: 'تصفح المسارات',
      join_now: 'انضم الآن',
    }
  };

  function getCurrentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  }

  function setDir(lang){
    const html = document.documentElement;
    const isAr = lang === 'ar';
    html.setAttribute('lang', isAr ? 'ar' : 'en');
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('rtl', isAr);
  }

  function translateAttr(el, key, attr){
    const lang = getCurrentLang();
    const val = dict[lang][key];
    if (val && el) el.setAttribute(attr, val);
  }

  function applyTranslations(){
    const lang = getCurrentLang();
    setDir(lang);
    const d = dict[lang] || {};

    // Generic [data-key] text content
    document.querySelectorAll('[data-key]').forEach(el => {
      const k = el.getAttribute('data-key');
      const val = d[k];
      if (typeof val === 'string') {
        // If element is input/textarea with placeholder, skip textContent
        if (el.matches('input,textarea,select')) return;
        el.textContent = val;
      }
    });

    // Attribute translations: [data-i18n-attr="placeholder" data-key="..."]
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const attr = el.getAttribute('data-i18n-attr');
      const k = el.getAttribute('data-key');
      const val = d[k];
      if (attr && typeof val === 'string') {
        el.setAttribute(attr, val);
      }
    });

    // Fallback: auto-translate common navbar links if no data-key provided
    document.querySelectorAll('nav a').forEach(a => {
      if (a.hasAttribute('data-key')) return;
      const href = (a.getAttribute('href') || '').toLowerCase();
      let k = null;
      if (href.includes('index')) k = 'home';
      else if (href.includes('about')) k = 'about';
      else if (href.includes('activities')) k = 'activities';
      else if (href.includes('join')) k = 'join';
      else if (href.includes('contact')) k = 'contact';
      else if (href.includes('dashboard')) k = 'dashboard';
      else if (href.includes('login')) k = 'login';
      if (k && d[k]) a.textContent = d[k];
    });

    // Buttons by known IDs (if present)
    const joinCtas = document.querySelectorAll('.cta-btn span');
    joinCtas.forEach(s => { 
      const k = s.getAttribute('data-key');
      const val = d[k];
      if (k && val) s.textContent = val;
    });

    // Known IDs placeholders/text when data attributes are not present
    const mapAttrs = [
      { sel: '#contactName', attr: 'placeholder', key: 'name' },
      { sel: '#contactEmail', attr: 'placeholder', key: 'email' },
      { sel: '#contactPhone', attr: 'placeholder', key: 'phone_optional' },
      { sel: '#contactMessage', attr: 'placeholder', key: 'message' },
    ];
    mapAttrs.forEach(m => {
      const el = document.querySelector(m.sel);
      if (el && d[m.key]) el.setAttribute(m.attr, d[m.key]);
    });
    const subj = document.querySelector('#contactSubject');
    if (subj) {
      const firstOpt = subj.querySelector('option[value=""]');
      if (firstOpt && d['select_subject']) firstOpt.textContent = d['select_subject'];
      const optMap = [
        ['general', 'general_inquiry'],
        ['membership', 'membership'],
        ['collaboration', 'collaboration'],
        ['event', 'event_inquiry'],
        ['other', 'other'],
      ];
      optMap.forEach(([val, key]) => {
        const o = subj.querySelector(`option[value="${val}"]`);
        if (o && d[key]) o.textContent = d[key];
      });
    }
  }

  function setLanguage(lang){
    const final = lang === 'ar' ? 'ar' : 'en';
    localStorage.setItem(STORAGE_KEY, final);
    // Toggle active state on known language buttons if they exist
    const enBtn = document.getElementById('en-btn');
    const arBtn = document.getElementById('ar-btn');
    if (enBtn) enBtn.classList.toggle('active', final === 'en');
    if (arBtn) arBtn.classList.toggle('active', final === 'ar');
    applyTranslations();
  }

  // Expose globally
  window.EMTA_I18N = {
    setLanguage,
    getCurrentLang
  };

  // Wire buttons if present
  document.addEventListener('DOMContentLoaded', () => {
    const enBtn = document.getElementById('en-btn');
    const arBtn = document.getElementById('ar-btn');
    if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
    if (arBtn) arBtn.addEventListener('click', () => setLanguage('ar'));
    // Initial
    setLanguage(getCurrentLang());
  });
})();
