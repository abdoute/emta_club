(function () {
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
      hero_badge_innovation: 'Innovation & Technology',
      scroll_down: 'Scroll',
      specialties_home_title: 'Department Specialties',
      specialties_home_subtitle: "Discover the pathways in the Département d'Électrotechnique et Automatique",
      specialties_auto_title: 'Automatique (AUTO)',
      specialties_auto_desc: 'From advanced control theory to real-time systems and industrial automation. At Master level, the branch AII (Automatique et Informatique Industrielle) focuses on smart control, embedded supervision, and digital industry.',
      specialties_elm_title: 'Électromécanique (ELM)',
      specialties_elm_desc: 'A multidisciplinary track combining electrical engineering and mechanics: machines, drives, and mechatronic integration. The Master keeps the same strong identity with deep industrial applications.',
      specialties_elt_title: 'Électrotechnique (ELT)',
      specialties_elt_desc: 'Power systems, machines, and energy conversion with a Master pathway in Réseaux Électriques (RE): grid modeling, protection, stability, and smart grids.',
      specialties_pre_title: 'Licence Pro — Protection des Réseaux Électriques',
      specialties_pre_desc: 'A professional 3-year license dedicated to protection, safety, and operation of electrical networks, with practical training and industry-aligned competencies.',
      specialties_cta: 'Explore Full Details',
      specialties_note: 'The department pathways typically start at L3 and continue through M2.',
      domain_electronics_title: 'Électronique (ELT)',
      domain_electronics_desc: 'Circuit design, embedded systems, and electronic innovations',
      domain_automation_title: 'Automatique (AUTO)',
      domain_automation_desc: 'Control systems, automation, and industrial processes',
      domain_robotics_title: 'Robotique (ROB)',
      domain_robotics_desc: 'Robotics, AI integration, and autonomous systems',
      domain_cs_title: 'Informatique (CS)',
      domain_cs_desc: 'Software development, algorithms, and computer science',
      domain_ai_title: 'Intelligence Artificielle (AI)',
      domain_ai_desc: 'Machine learning, neural networks, and AI applications',
      feature_workshops_title: 'Hands-on Workshops',
      feature_workshops_desc: 'Learn by doing with practical workshops on cutting-edge technologies',
      feature_networking_title: 'Networking',
      feature_networking_desc: 'Connect with like-minded students and industry professionals',
      feature_projects_title: 'Innovation Projects',
      feature_projects_desc: 'Work on real-world projects and bring your ideas to life',
      feature_competitions_title: 'Competitions',
      feature_competitions_desc: 'Participate in hackathons and technical competitions',
      feature_skills_title: 'Skill Development',
      feature_skills_desc: 'Enhance your technical and soft skills through various activities',
      feature_collaboration_title: 'Collaboration',
      feature_collaboration_desc: 'Work in teams and learn the art of collaborative engineering',
      testimonials_subtitle: 'Hear from students who are part of our community',
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
      rating_title: 'Rate E-MTA Club',
      rating_label: 'Your rating:',
      rating_not_rated: 'Not rated yet',
      rating_thanks: 'Thanks for your rating!',
      office_open: 'Open Now',
      office_closed: 'Closed',
      contact_fill_required: '⚠️ Please fill in all required fields.',
      contact_invalid_email: '📧 Please enter a valid email address.',
      contact_sending: 'Sending...',
      contact_success_generic: '✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
      contact_error_generic: '❌ Failed to submit: {error}',
      join_fill_required: '⚠️ Please fill in all fields.',
      join_invalid_email: '📧 Please enter a valid email address.',
      join_invalid_registration: '🆔 Please enter a valid registration number (8-12 digits).',
      join_sending: 'Sending...',
      join_success_generic: '✅ Thank you! Your application has been received.',
      admin_welcome_redirect: '🔐 Welcome admin {name}. Redirecting to Admin...',
      login_required: 'Email and password are required',
      login_signing_in: 'Signing in...',
      login_success: 'Logged in successfully',
      login_admin_only: 'This login is reserved for admin accounts only.',
      events_status_upcoming: 'Upcoming',
      events_status_past: 'Past',
      events_learn_more: 'Learn More',
      events_no_upcoming_title: 'No Upcoming Events',
      events_no_upcoming_desc: 'Check back soon for new activities!',
      events_no_past_title: 'No Past Events',
      events_no_past_desc: "We're just getting started!",
      gallery_no_images_title: 'No Gallery Images',
      gallery_no_images_desc: 'Gallery images will appear here soon!',
      // About page
      aboutHeroBadge: 'Our Community',
      aboutTitle: 'About E-MTA Club',
      aboutIntro: 'A dynamic scientific club fostering innovation and collaboration at Université 8 Mai 1945 – Guelma. We bring together passionate students to explore technology and shape the future.',
      about_core_team_label: 'Core Team',
      about_members_label: 'Members',
      about_years_active_label: 'Years Active',
      about_join_btn: 'Join Us',
      about_meet_team_btn: 'Meet Our Team',
      about_foundation_title: 'Our Foundation',
      about_foundation_subtitle: 'The principles that guide our mission',
      missionTitle: 'Mission',
      missionText: 'Promote scientific & technical culture among students through workshops, projects and events. We empower future engineers with practical skills and innovative thinking.',
      visionTitle: 'Vision',
      visionText: 'Forming an innovative generation ready for Industry 4.0. We strive to bridge the gap between academic knowledge and real-world applications.',
      valuesTitle: 'Values',
      valuesText: 'Collaboration · Innovation · Excellence · Integrity · Passion for Learning',
      teamTitle: 'Core Team',
      teamSubtitle: 'The leadership team driving E-MTA Club forward',
      supportingTeamTitle: 'Supporting Team',
      supportingTeamSubtitle: 'Dedicated members helping organize events and activities',
      supporting_show_more: 'Show more',
      supporting_show_less: 'Show less',
      domainsTitle: 'Our Domains',
      domainsSubtitle: 'Fields of expertise we explore and develop',
      timelineTitle: 'Our Journey',
      timelineSubtitle: "Key milestones in our club's history",
      timeline_foundation_title: 'Foundation',
      timeline_foundation_desc: 'Creation of the E-MTA Club',
      timeline_first_workshop_title: 'First Workshop',
      timeline_first_workshop_desc: 'First Arduino workshop',
      timeline_national_recognition_title: 'National Recognition',
      timeline_national_recognition_desc: 'Participation in the national hackathon',
      timeline_scientific_day_title: 'Scientific Day',
      timeline_scientific_day_desc: 'Organization of the E-MTA Scientific Day',

      // Join page
      join_hero_badge: 'Join Our Community',
      join_hero_active_members: 'Active Members',
      join_hero_workshops: 'Workshops',
      join_hero_projects: 'Projects',
      join_info_quick_title: 'Quick Process',
      join_info_quick_desc: 'Simple application form that takes just a few minutes to complete',
      join_info_secure_title: 'Secure & Private',
      join_info_secure_desc: 'Your information is safe and will only be used for club purposes',
      join_info_fast_title: 'Fast Response',
      join_info_fast_desc: "We'll review your application and get back to you within 48 hours",
      join_form_title: 'Membership Application',
      join_form_subtitle: 'Fill in the form below to apply for joining E-MTA Club. We\'ll get back to you soon!',
      join_feature_free: 'Free Membership',
      join_feature_events: 'Workshops & Events',
      join_feature_networking: 'Networking Opportunities',
      join_label_full_name: 'Full Name',
      join_label_registration: 'Registration Number',
      join_label_email: 'E-mail',
      join_label_phone: 'Phone Number',
      join_label_level: 'Academic Level',
      join_label_specialty: 'Specialty',
      join_label_other_specialty: 'Specify Specialty',
      join_label_motivation: 'Motivation',
      join_placeholder_full_name: 'Enter your full name',
      join_placeholder_registration: 'e.g. 202136012345',
      join_placeholder_email: 'example@univ-guelma.dz',
      join_placeholder_phone: '06 12 34 56 78',
      join_placeholder_other_specialty: 'Enter your specialty...',
      join_placeholder_motivation: 'Tell us briefly why you want to join...',
      join_select_level_placeholder: 'Select your level',
      join_select_specialty_placeholder: 'Please select your academic level first',
      join_specialty_hint: 'Select your academic level above to see available specialties',
      join_char_count_suffix: 'characters',
      join_progress_template: '{percent}% Complete',
      join_send_application: 'Send Application',
      join_invalid_phone: '📱 Please enter a valid phone number (10 digits).',

      // Contact page
      contactHeroBadge: 'Get In Touch',
      contact_location_title: 'Location',
      contact_location_university: 'University of 8 Mai 1945',
      contact_location_city: 'Guelma, Algeria',
      contact_location_view_map: 'View on Map',
      contact_email_title: 'Email',
      contact_email_primary: 'emtaclub@gmail.com',
      contact_email_cta: 'Send Email',
      contact_phone_title: 'Phone',
      contact_phone_available: 'Available: Mon-Fri, 9AM-5PM',
      contact_phone_cta: 'Call Now',
      contact_office_hours_title: 'Office Hours',
      contact_office_hours_days: 'Monday - Friday',
      contact_office_hours_time: '9:00 AM - 5:00 PM',
      contact_office_status_check: 'Check Status',
      contact_form_title: 'Send Us a Message',
      contact_form_subtitle: "Fill out the form below and we'll get back to you as soon as possible",
      contact_label_name: 'Your Name',
      contact_label_email: 'Email Address',
      contact_label_subject: 'Subject',
      contact_label_phone: 'Phone (Optional)',
      contact_label_message: 'Message',
      contact_placeholder_name: 'Enter your name',
      contact_placeholder_email: 'your.email@example.com',
      contact_placeholder_phone: '+213 XXX XXX XXX',
      contact_placeholder_message: 'Tell us how we can help you...',
      contact_send_btn: 'Send Message',
      contact_follow_us: 'Follow Us',
      contact_facebook: 'Facebook',
      contact_instagram: 'Instagram',
      contact_telegram: 'Telegram',
      contact_linkedin: 'LinkedIn',
      contact_quick_links: 'Quick Links',
      contact_about_us: 'About Us',
      contact_join_club: 'Join the Club',
      contact_upcoming_events_link: 'Upcoming Events',
      contact_faq_link: 'FAQ',
      contact_need_help: 'Need Help?',
      contact_need_help_text: 'If you have urgent questions or need immediate assistance, feel free to reach out through our social media channels or visit our office during working hours.',
      contact_faq_title: 'Frequently Asked Questions',
      contact_faq_subtitle: 'Find answers to common questions',

      // FAQ Questions and Answers in English
      faq_join_question: 'How can I join E-MTA Club?',
      faq_join_answer: "You can join by filling out the membership form on the 'Join Us' page. We'll review your application and get back to you within 48 hours.",
      faq_student_requirement_question: 'Do I have to be a student at University 8 Mai 1945 to join?',
      faq_student_requirement_answer: 'Yes, E-MTA Club is exclusively for students of University 8 Mai 1945 – Guelma. You will need to provide your university email when registering.',
      faq_membership_cost_question: 'Is the membership free?',
      faq_membership_cost_answer: 'Yes, membership is completely free! We believe in making tech education accessible to all students.',
      faq_activities_question: 'What activities does the club organize?',
      faq_activities_answer: 'We organize workshops in various topics (Arduino, Web Development, AI, etc.), hackathons, scientific talks, and collaborative projects. Check our Activities page for upcoming events.',
      faq_workshop_frequency_question: 'How often are workshops held?',
      faq_workshop_frequency_answer: 'We usually hold workshops every 2–3 weeks during the academic year. Follow us on social media to stay updated.',
      faq_beginner_friendly_question: 'Can I participate if I am a beginner?',
      faq_beginner_friendly_answer: 'Absolutely! We welcome students of all levels. Our workshops are designed for beginners as well as advanced students.',
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
      hero_badge_innovation: 'الابتكار والتكنولوجيا',
      scroll_down: 'مرّر للأسفل',
      specialties_home_title: 'تخصصات القسم',
      specialties_home_subtitle: 'اكتشف المسارات في قسم الإلكتروتقني والأتمتة',
      specialties_auto_title: 'الأتمتة (Automatique)',
      specialties_auto_desc: 'من نظرية التحكم المتقدم إلى الأنظمة الآنية والأتمتة الصناعية. في طور الماستر يركّز فرع AII (الأتمتة والمعلوماتية الصناعية) على التحكم الذكي، الإشراف المدمج، والصناعة الرقمية.',
      specialties_elm_title: 'الإلكتروميكانيك (Électromécanique)',
      specialties_elm_desc: 'تخصص متعدد يجمع بين الهندسة الكهربائية والميكانيكية: الآلات، المبدّلات، والدمج الميكاتروني. يحافظ طور الماستر على نفس الهوية القوية مع تطبيقات صناعية عميقة.',
      specialties_elt_title: 'الإلكتروتقني (Électrotechnique)',
      specialties_elt_desc: 'منظومات القدرة، الآلات، وتحويل الطاقة مع مسار ماستر في RE (الشبكات الكهربائية): نمذجة الشبكات، الحماية، الاستقرار، والشبكات الذكية.',
      specialties_pre_title: 'ليسانس مهنية — حماية الشبكات الكهربائية',
      specialties_pre_desc: 'ليسانس مهنية بثلاث سنوات مخصّصة لحماية، أمان، وتشغيل الشبكات الكهربائية مع تكوين تطبيقي وكفاءات ملائمة للصناعة.',
      specialties_cta: 'اكتشف التفاصيل الكاملة',
      specialties_note: 'تبدأ مسارات القسم عادة من L3 وتستمر إلى M2.',
      domain_electronics_title: 'الإلكترونيك',
      domain_electronics_desc: 'تصميم الدوائر، الأنظمة المضمنة، والابتكارات الإلكترونية',
      domain_automation_title: 'الأتمتة',
      domain_automation_desc: 'أنظمة التحكم، الأتمتة، والعمليات الصناعية',
      domain_robotics_title: 'الروبوتيك',
      domain_robotics_desc: 'الروبوتات، تكامل الذكاء الاصطناعي، والأنظمة الذاتية',
      domain_cs_title: 'الإعلام الآلي',
      domain_cs_desc: 'تطوير البرمجيات، الخوارزميات، وعلوم الحاسوب',
      domain_ai_title: 'الذكاء الاصطناعي',
      domain_ai_desc: 'التعلّم الآلي، الشبكات العصبية، وتطبيقات الذكاء الاصطناعي',
      feature_workshops_title: 'ورشات تطبيقية',
      feature_workshops_desc: 'تعلّم بالممارسة من خلال ورشات عملية حول أحدث التقنيات',
      feature_networking_title: 'التواصل والشبكات',
      feature_networking_desc: 'تواصل مع طلبة يشبهونك ومع مهنيّي الصناعة',
      feature_projects_title: 'مشاريع ابتكارية',
      feature_projects_desc: 'اشتغل على مشاريع حقيقية وحوّل أفكارك إلى واقع',
      feature_competitions_title: 'مسابقات',
      feature_competitions_desc: 'شارك في الهاكاثونات والمسابقات التقنية',
      feature_skills_title: 'تطوير المهارات',
      feature_skills_desc: 'طوّر مهاراتك التقنية والناعمة عبر مختلف الأنشطة',
      feature_collaboration_title: 'التعاون',
      feature_collaboration_desc: 'اعمل ضمن فرق وتعلّم فن الهندسة التعاونية',
      testimonials_subtitle: 'آراء طلبة هم جزء من مجتمعنا',
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
      rating_title: 'قيّم نادي E-MTA',
      rating_label: 'تقييمك:',
      rating_not_rated: 'لم يتم التقييم بعد',
      rating_thanks: 'شكراً على تقييمك!',
      office_open: 'مفتوح الآن',
      office_closed: 'مغلق',
      contact_fill_required: '⚠️ يرجى ملء جميع الحقول المطلوبة.',
      contact_invalid_email: '📧 يرجى إدخال بريد إلكتروني صالح.',
      contact_sending: 'جارٍ الإرسال...',
      contact_success_generic: '✅ شكراً لك! تم إرسال رسالتك بنجاح وسنرد عليك قريباً.',
      contact_error_generic: '❌ فشل الإرسال: {error}',
      join_fill_required: '⚠️ يرجى ملء جميع الحقول.',
      join_invalid_email: '📧 يرجى إدخال بريد إلكتروني صالح.',
      join_invalid_registration: '🆔 يرجى إدخال رقم تسجيل صحيح (8-12 رقماً).',
      join_sending: 'جارٍ الإرسال...',
      join_success_generic: '✅ شكراً لك! تم استلام طلب انضمامك.',
      admin_welcome_redirect: '🔐 أهلاً بالمسؤول {name}. سيتم تحويلك إلى صفحة الإدارة...',
      login_required: 'البريد الإلكتروني وكلمة المرور مطلوبان',
      login_signing_in: 'جارٍ تسجيل الدخول...',
      login_success: 'تم تسجيل الدخول بنجاح',
      login_admin_only: 'صفحة تسجيل الدخول هذه مخصصة لحسابات الإدارة فقط.',
      events_status_upcoming: 'قادمة',
      events_status_past: 'سابقة',
      events_learn_more: 'اكتشف المزيد',
      events_no_upcoming_title: 'لا توجد فعاليات قادمة',
      events_no_upcoming_desc: 'عد لاحقاً للاطلاع على نشاطات جديدة!',
      events_no_past_title: 'لا توجد فعاليات سابقة',
      events_no_past_desc: 'لقد بدأنا للتو!',
      gallery_no_images_title: 'لا توجد صور في المعرض',
      gallery_no_images_desc: 'ستظهر صور المعرض هنا قريباً!',
      // About page
      aboutHeroBadge: 'مجتمعنا',
      aboutTitle: 'حول نادي E-MTA',
      aboutIntro: 'نادي علمي ديناميكي يدعم الابتكار والتعاون في جامعة 8 ماي 1945 – قالمة. نجمع الطلبة الشغوفين بالتكنولوجيا لصناعة المستقبل.',
      about_core_team_label: 'الفريق الأساسي',
      about_members_label: 'الأعضاء',
      about_years_active_label: 'سنوات من النشاط',
      about_join_btn: 'انضم إلينا',
      about_meet_team_btn: 'تعرّف على فريقنا',
      about_foundation_title: 'أساسياتنا',
      about_foundation_subtitle: 'المبادئ التي تقود رسالتنا',
      missionTitle: 'الرسالة',
      missionText: 'نشر الثقافة العلمية والتقنية بين الطلبة عبر الورشات، المشاريع والفعاليات. نمكّن مهندسي المستقبل بمهارات عملية وفكر ابتكاري.',
      visionTitle: 'الرؤية',
      visionText: 'تكوين جيل مبتكر جاهز للصناعة 4.0، ونسعى لردم الفجوة بين المعارف الأكاديمية والتطبيقات الواقعية.',
      valuesTitle: 'القيم',
      valuesText: 'التعاون · الابتكار · التميّز · النزاهة · شغف التعلّم',
      teamTitle: 'الفريق الأساسي',
      teamSubtitle: 'فريق القيادة الذي يدفع نادي E-MTA إلى الأمام',
      supportingTeamTitle: 'الفريق المساند',
      supportingTeamSubtitle: 'أعضاء مخلصون يساهمون في تنظيم الفعاليات والأنشطة',
      supporting_show_more: 'عرض المزيد',
      supporting_show_less: 'عرض أقل',
      domainsTitle: 'مجالاتنا',
      domainsSubtitle: 'مجالات الخبرة التي نستكشفها ونطوّرها',
      timelineTitle: 'رحلتنا',
      timelineSubtitle: 'أهم المحطات في تاريخ النادي',
      timeline_foundation_title: 'التأسيس',
      timeline_foundation_desc: 'إنشاء نادي E-MTA',
      timeline_first_workshop_title: 'أول ورشة',
      timeline_first_workshop_desc: 'أول ورشة Arduino',
      timeline_national_recognition_title: 'اعتراف وطني',
      timeline_national_recognition_desc: 'المشاركة في الهاكاثون الوطني',
      timeline_scientific_day_title: 'اليوم العلمي',
      timeline_scientific_day_desc: 'تنظيم اليوم العلمي لنادي E-MTA',

      // Join page
      join_hero_badge: 'انضم إلى مجتمعنا',
      join_hero_active_members: 'أعضاء نشطون',
      join_hero_workshops: 'ورشات',
      join_hero_projects: 'مشاريع',
      join_info_quick_title: 'إجراءات سريعة',
      join_info_quick_desc: 'استمارة انضمام بسيطة لا تستغرق سوى بضع دقائق لملئها',
      join_info_secure_title: 'آمن وسري',
      join_info_secure_desc: 'معلوماتك محفوظة ولن تُستعمل إلا لأغراض النادي',
      join_info_fast_title: 'رد سريع',
      join_info_fast_desc: 'سنراجع طلبك ونرد عليك في غضون 48 ساعة',
      join_form_title: 'استمارة الانضمام',
      join_form_subtitle: 'املأ الاستمارة أدناه للتقدّم للانضمام إلى نادي E-MTA. سنرد عليك قريباً!',
      join_feature_free: 'عضوية مجانية',
      join_feature_events: 'ورشات وفعاليات',
      join_feature_networking: 'فرص للتعارف وبناء العلاقات',
      join_label_full_name: 'الاسم الكامل',
      join_label_registration: 'رقم التسجيل',
      join_label_email: 'البريد الإلكتروني',
      join_label_phone: 'رقم الهاتف',
      join_label_level: 'المستوى الدراسي',
      join_label_specialty: 'التخصص',
      join_label_other_specialty: 'حدد التخصص',
      join_label_motivation: 'دافع الانضمام',
      join_placeholder_full_name: 'اكتب اسمك الكامل',
      join_placeholder_registration: 'مثال: 202136012345',
      join_placeholder_email: 'example@univ-guelma.dz',
      join_placeholder_phone: '06 12 34 56 78',
      join_placeholder_other_specialty: 'أدخل تخصصك...',
      join_placeholder_motivation: 'أخبرنا باختصار لماذا تريد الانضمام...',
      join_select_level_placeholder: 'اختر مستواك',
      join_select_specialty_placeholder: 'يرجى اختيار المستوى الدراسي أولاً',
      join_specialty_hint: 'اختر مستواك الدراسي أعلاه لعرض التخصصات المتاحة',
      join_char_count_suffix: 'حرفاً',
      join_progress_template: '{percent}% مكتمل',
      join_send_application: 'إرسال طلب الانضمام',
      join_invalid_phone: '📱 يرجى إدخال رقم هاتف صحيح (10 أرقام).',
      contactHeroBadge: 'تواصل معنا',
      contactTitle: 'اتصل بنا',
      contactIntro: 'هل لديك أسئلة؟ تريد التعاون؟',
      contactIntro2: 'تواصل معنا من خلال أي من القنوات التالية.',
      contact_location_title: 'الموقع',
      contact_location_university: 'جامعة 8 ماي 1945',
      contact_location_city: 'قالمة، الجزائر',
      contact_location_view_map: 'عرض على الخريطة',
      contact_email_title: 'راسلنا عبر البريد الإلكتروني',
      contact_email_help: 'سنجيب خلال 24 ساعة',
      contact_phone_title: 'اتصل بنا',
      contact_office_hours: 'متاح من الساعة 9:00 صباحاً حتى 5:00 مساءً',
      contact_form_title: 'أرسل لنا رسالة',
      contact_form_subtitle: 'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن',
      contact_label_name: 'الاسم الكامل',
      contact_label_email: 'البريد الإلكتروني',
      contact_label_phone: 'رقم الهاتف (اختياري)',
      contact_label_subject: 'الموضوع',
      contact_label_message: 'الرسالة',
      contact_send_btn: 'إرسال الرسالة',
      contact_follow_us: 'تابعنا على',
      contact_facebook: 'فيسبوك',
      contact_instagram: 'إنستغرام',
      contact_linkedin: 'لينكد إن',
      contact_github: 'جيت هاب',
      contact_youtube: 'يوتيوب',
      contact_faq_title: 'الأسئلة الشائعة',
      contact_faq_subtitle: 'إجابات على الأسئلة المتداولة',

      // FAQ Questions and Answers in Arabic
      faq_join_question: 'كيف يمكنني الانضمام إلى نادي E-MTA؟',
      faq_join_answer: 'يمكنك الانضمام عن طريق ملء استمارة العضوية في صفحة \'انضم إلينا\'. سنراجع طلبك وسنرد عليك في غضون 48 ساعة.',
      faq_student_requirement_question: 'هل يجب أن أكون طالباً في جامعة 8 ماي 1945 للانضمام؟',
      faq_student_requirement_answer: 'نعم، نادي E-MTA مخصص حصرياً لطلاب جامعة 8 ماي 1945 - قالمة. ستحتاج إلى تقديم بريدك الإلكتروني الجامعي أثناء التسجيل.',
      faq_membership_cost_question: 'هل العضوية مجانية؟',
      faq_membership_cost_answer: 'نعم، العضوية مجانية بالكامل! نؤمن بجعل التعليم التكنولوجي في متناول جميع الطلاب.',
      faq_activities_question: 'ما هي الأنشطة التي ينظمها النادي؟',
      faq_activities_answer: 'ننظم ورش عمل في مواضيع مختلفة (أردوينو، تطوير الويب، الذكاء الاصطناعي، إلخ)، وهاكاثونات، ومؤتمرات علمية، ومشاريع تعاونية. تحقق من صفحة الأنشطة لدينا للتعرف على الفعاليات القادمة.',
      faq_workshop_frequency_question: 'كم مرة تُعقد ورش العمل؟',
      faq_workshop_frequency_answer: 'نقوم عادةً بعقد ورش العمل كل أسبوعين إلى ثلاثة أسابيع خلال العام الدراسي. تابعنا على وسائل التواصل الاجتماعي لتبقى على اطلاع بجدولنا الزمني.',
      faq_beginner_friendly_question: 'هل يمكنني المشاركة إذا كنت مبتدئاً؟',
      faq_beginner_friendly_answer: 'بالتأكيد! نرحب بالطلاب من جميع المستويات. تم تصميم ورش العمل لدينا لتناسب المبتدئين وكذلك الطلاب المتقدمين.',
      join_specialty_hint: 'اختر مستواك الدراسي أعلاه لعرض التخصصات المتاحة',
      join_char_count_suffix: 'حرفاً',
      join_progress_template: '{percent}% مكتمل',
      join_send_application: 'إرسال طلب الانضمام',

      // Contact page
      contactHeroBadge: 'تواصل معنا',
      contact_location_title: 'الموقع',
      contact_location_university: 'جامعة 8 ماي 1945',
      contact_location_city: 'قالمة، الجزائر',
      contact_location_view_map: 'عرض على الخريطة',
      contact_email_title: 'البريد الإلكتروني',
      contact_email_primary: 'emtaclub@gmail.com',
      contact_email_cta: 'إرسال بريد',
      contact_phone_title: 'الهاتف',
      contact_phone_available: 'متاح: من الإثنين إلى الجمعة، 9:00–17:00',
      contact_phone_cta: 'اتصل الآن',
      contact_office_hours_title: 'ساعات العمل',
      contact_office_hours_days: 'من الإثنين إلى الجمعة',
      contact_office_hours_time: '9:00 صباحاً - 5:00 مساءً',
      contact_office_status_check: 'تحقق من الحالة',
      contact_form_title: 'أرسل لنا رسالة',
      contact_form_subtitle: 'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن',
      contact_label_name: 'اسمك',
      contact_label_email: 'البريد الإلكتروني',
      contact_label_subject: 'الموضوع',
      contact_label_phone: 'الهاتف (اختياري)',
      contact_label_message: 'الرسالة',
      contact_placeholder_name: 'اكتب اسمك',
      contact_placeholder_email: 'your.email@example.com',
      contact_placeholder_phone: '+213 XXX XXX XXX',
      contact_placeholder_message: 'أخبرنا كيف يمكننا مساعدتك...',
      contact_send_btn: 'إرسال الرسالة',
      contact_follow_us: 'تابعنا',
      contact_facebook: 'فيسبوك',
      contact_instagram: 'إنستغرام',
      contact_telegram: 'تيليغرام',
      contact_linkedin: 'لينكدإن',
      contact_quick_links: 'روابط سريعة',
      contact_about_us: 'من نحن',
      contact_join_club: 'انضم إلى النادي',
      contact_upcoming_events_link: 'الفعاليات القادمة',
      contact_faq_link: 'الأسئلة الشائعة',
      contact_need_help: 'تحتاج مساعدة؟',
      contact_need_help_text: 'إذا كانت لديك أسئلة مستعجلة أو تحتاج إلى مساعدة فورية، لا تتردد في التواصل معنا عبر قنوات التواصل الاجتماعي أو زيارة مكتبنا خلال ساعات العمل.',
      contact_faq_title: 'الأسئلة الشائعة',
      contact_faq_subtitle: 'اعثر على إجابات لأكثر الأسئلة تكراراً',
    }
  };

  function getCurrentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  }

  function setDir(lang) {
    const html = document.documentElement;
    const isAr = lang === 'ar';
    html.setAttribute('lang', isAr ? 'ar' : 'en');
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('rtl', isAr);
  }

  function t(key, vars) {
    const lang = getCurrentLang();
    const d = dict[lang] || {};
    let val = d[key] || key;
    if (vars && typeof val === 'string') {
      Object.keys(vars).forEach(k => {
        const re = new RegExp('\\{' + k + '\\}', 'g');
        val = val.replace(re, String(vars[k]));
      });
    }
    return val;
  }

  function translateAttr(el, key, attr) {
    const lang = getCurrentLang();
    const val = dict[lang][key];
    if (val && el) el.setAttribute(attr, val);
  }

  function applyTranslations() {
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

  function setLanguage(lang) {
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
    getCurrentLang,
    t
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
