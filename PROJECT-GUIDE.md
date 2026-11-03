# SiteRadar — الدليل التقني والسياق الكامل للمطوّر أو AI آخر

هذا شرح للكود الموجود بتاريخ 3 نوفمبر 2026، وليس اقتراح إعادة بناء. اقرأه مع [HANDOFF.md](HANDOFF.md) الذي يحتوي خطوات Mac، المتطلبات غير القابلة للتغيير، والمشاكل المتبقية. المواصفات الأصلية في [docs/original-product-spec-ar.md](docs/original-product-spec-ar.md) أكبر من النطاق المنفّذ فعلًا.

## هل يوجد Node.js منفصل؟

**الكود كله في نفس المستودع ونفس المجلد ونفس `package.json`، لكنه يعمل بعمليتين أساسيتين:**

1. **Next.js server**: يشغّل الواجهة وServer Components وHTTP API على `127.0.0.1:3000`. هذا backend يعمل على Node.js أيضًا؛ Next ليس مجرد واجهة.
2. **Node.js worker**: ملف `server/worker.ts`، عملية مستقلة تنفّذ الفحوصات الثقيلة وتفتح Chromium. ليس له HTTP port أو Express API خاص به.

لا يوجد مشروع backend ثانٍ، ولا Express أو NestJS، ولا قاعدة بيانات تحتاج تشغيل خدمة خارجية. اسم مجلد `server/` يعني كود السيرفر، وليس أن كل ملف فيه يشغّل سيرفرًا مستقلًا. بعض ملفاته يستوردها Next وبعضها يستوردها worker.

```text
Browser — React / Workspace
           |
           | HTTP + session cookie
           v
Next.js :3000 — pages + /api/*
           |
           | read/write
           v
data/siteradar.sqlite <—— read/write —— Node worker
                                           |
                                           +— HTTPS crawler + robots.txt
                                           +— Chromium / Playwright
                                           +— Lighthouse + axe
                                           +— SerpApi (optional)
```

**التواصل بين Next والـworker يتم عبر SQLite، وليس HTTP أو WebSocket أو Redis.** Next يكتب audit بحالة queued؛ worker يقرأه ويحدّثه؛ الواجهة تعمل polling للـAPI لترى التقدّم.

`npm run dev` يستخدم concurrently لتشغيل العمليتين بأمر واحد. Next يعمل بوضع التطوير والـworker عبر `node --watch server/worker.ts`. عند إيقاف الأمر، `concurrently -k` يوقف المجموعة. `npm start` يشغّل Next production والـworker بدون watch بعد `npm run build`.

إذا احتجت تشخيص كل عملية وحدها، افتح terminalين **من نفس جذر المشروع**:

```bash
# Terminal 1: web فقط
node scripts/next.mjs dev --hostname 127.0.0.1
```

```bash
# Terminal 2: worker فقط
npm run worker
```

لا تشغّل هذا بالإضافة إلى `npm run dev` بلا حاجة؛ ذلك قد يسبب تعارض port. توجد worker lease لمنع تشغيل أكثر من مستهلك محلي في نفس الوقت، لكنها ليست بديلًا عن تنظيم العمليات.

## الأدوات والمكتبات ووظيفة كل واحدة

النسخ الفعلية مثبتة في `package-lock.json`. استخدم `npm ci` لإعادتها على Mac؛ ranges في `package.json` لا تعني أن أي إصدار جديد تمت مراجعته.

| الأداة | دورها في المشروع |
|---|---|
| Node.js 24.11+ | runtime لـNext والـworker؛ يوفر SQLite وcrypto وnative TypeScript stripping |
| Next.js 16.4.4 | App Router، صفحات SSR وServer Components، API Route Handlers، metadata وSEO |
| React / React DOM 19 | المكوّنات والتفاعل وstate على العميل وعرض الواجهة |
| TypeScript | عقود Audit/Project/Finding والتحقق وقت البناء؛ ليس بديلًا عن التحقق من المدخلات أثناء التشغيل |
| Tailwind CSS v4 + `@tailwindcss/postcss` | طبقة styling عبر PostCSS، مع CSS مخصص واسع في `app/globals.css` و`app/product.css` |
| `@fontsource-variable/manrope` | خط الواجهة، ملفات محلية بدل تحميل الخط من خدمة خارجية |
| `@fontsource/ibm-plex-mono` | خط monospace للأرقام/تفاصيل تقنية |
| `@phosphor-icons/react` | نظام الأيقونات المستخدم |
| `@radix-ui/react-dialog` | dialogs قابلة للوصول وإدارة focus للنوافذ |
| Recharts | رسوم الدرجات وسجل القياسات؛ لا ينشئ بيانات قياس بنفسه |
| Sonner | تنبيهات نجاح/خطأ الواجهة |
| Zod | التحقق من scan input ونماذج الحسابات واستجابة provider غير الموثوقة |
| Cheerio | قراءة HTML واستخراج title/headings/canonical/links/schema وغيرها |
| robots-parser | تفسير robots.txt قبل زحف الصفحات |
| ipaddr.js | تصنيف IPs وحظر الوجهات الخاصة وغير العامة |
| Playwright | تشغيل/التحكم في Chromium وإحضار HTML بعد rendering |
| chrome-launcher | إطلاق Chrome وربط Lighthouse بعملية المتصفح |
| Lighthouse 13.5.0 | قياسات مختبرية للأداء ودرجات accessibility/SEO/best practices للـhomepage |
| `@axe-core/playwright` | فحص accessibility آلي وإرجاع violations وأدلتها |
| `node:sqlite` | SQLite مدمج في Node، ملف محلي مشترك بين Next والـworker؛ لا Prisma/ORM |
| `node:crypto` | scrypt وsession hashing وAES-GCM وstable page IDs |
| concurrently | تشغيل web وworker معًا من npm scripts |
| Vitest | unit/security tests، وليس مشغّل backend |

لا توجد حاليًا OpenAI API أو LLM API أو خدمة AI مطلوبة. زر Fix prompt يركّب نصًا من الأدلة بشكل deterministic ليأخذه المستخدم إلى مساعد برمجة. SerpApi خدمة نتائج بحث، وليس نموذج ذكاء اصطناعي.

## الواجهة والـbackend: أين أكتب التعديل؟

- `app/`: صفحات App Router وRoute Handlers. `[slug]` يعني dynamic segment، و`[[...segments]]` catch-all اختياري. `params` في الكود الحالي Promise يتم await لها.
- `app/layout.tsx`: الجذر، CSS، toast provider، metadata العامة.
- `app/page.tsx` و`components/landing.tsx`: landing؛ public shell يضيف header/footer.
- `app/pricing/page.tsx`: Free وComing soon plans. لا تضف اشتراكًا أو limits للـFree.
- `lib/docs.ts` + `components/docs-browser.tsx` + `app/docs/`: محتوى docs والبحث/المقالات.
- `components/workspace.tsx`: workspace كبير يجمع الأقسام، التصفية والتصدير وحالة الفحص. افحص callers قبل تغيير navigation أو state؛ لا تعِد كتابته كاملًا لمجرد أنه كبير.
- `components/new-audit.tsx`: إعداد وتشغيل فحص. `performance-panel`, `live-keywords`, `live-competitors`, `project-chart`: عرض النتائج المتخصصة.
- `server/`: منطق backend والأمان والتنفيذ. لا تستورد db أو secrets أو crawler في Client Components.
- `lib/`: types وrouting وSEO وexample ومحتوى مشترك. راقب import boundaries حتى لا يصل server code للمتصفح.

`'use client'` يحدد المكوّنات التفاعلية. Server Components يمكنها قراءة الجلسة/البيانات وإرسال props آمنة إلى العميل. لا ترسل password hashes أو secret encryption material ضمن props أو API.

## دورة الفحص من النقر حتى التقرير

1. المستخدم يسجّل الدخول ويفتح New website أو يعيد فحص مشروع محفوظ. AuditConfig يحتوي URL، country، language، device، maxPages، keywords، authorized.
2. الواجهة ترسل `POST /api/audits`. السيرفر يتحقق من Host/Origin، الجلسة، حجم body، Zod، وURL المستهدف.
3. `saveProject` يطبّع origin ويجد أو ينشئ مشروعًا لنفس owner+origin ويحفظ config. الرابط نفسه لمستخدمين مختلفين يعني مشروعين مملوكين لكل منهما.
4. إذا يوجد queued/running audit لنفس مشروع المستخدم، يُعاد بدل تكرار job فعّال. غير ذلك ينشئ audit UUID بحالة queued وscore=null ويحفظه.
5. worker يحصل على lease، ثم `claimAudit()` داخل transaction يحوّل أول queued job إلى running. لا توجد jobs table مستقلة؛ جدول audits نفسه يمثل queue.
6. يفحص public HTTPS origin وrobots.txt؛ فشل robots غير 404 يوقف الفحص بحذر. يبدأ Chromium إن أمكن.
7. يزور الروابط المسموح بها داخل نفس origin ضمن حد الصفحات وميزانية الزمن. safeFetch يتحقق من DNS/redirects؛ HTML المحلّل يأتي من rendering عند توفّره، مع fallback/إفصاح عند فشل المتصفح.
8. `analyzeHtml` ينتج AuditPage، findings وروابط إضافية. إذا لم تُدخل keywords، يحاول اقتراح كلمات من titles/headings؛ هذه اقتراحات محتوى وليست بحث حجم كلمات مدفوعًا.
9. يقيس homepage باستخدام Lighthouse وaxe. عدم توفر browser/performance يُحفظ كخطأ قياس، ولا يُستبدل برقم demo.
10. إذا يوجد owner ومفتاح provider، يطلب SerpApi لكل keyword ويحفظ نتائج البحث والسياق والتاريخ. عدم وجود المفتاح لا يمنع فحص HTML/performance.
11. يجمّع findings حسب rule، يحفظ صفحاتها وأدلتها، يرتّب severity، يحسب scores، ثم يضع completed وcompletedAt. exceptions تؤدي failed؛ cancellation يحافظ على البيانات الجزئية.
12. الواجهة تقرأ `GET /api/audits/:id` أثناء العمل كل نحو ثانيتين وتعرض progress/events، ثم التقرير.

فحص مكتمل قد يحتوي missing measurements؛ completed يعني انتهاء المسار، وليس أن كل مصدر خارجي نجح. اقرأ `measurementError`, `rankingStatus` وأخطاء RankRecord.

## البيانات والعلاقات والـIDs

قاعدة البيانات في `data/siteradar.sqlite`، WAL مفعّل، busy_timeout=5000ms. المسار مرتبط بـcurrent working directory، لذا شغّل كل الأوامر من جذر المشروع. إنشاء الجداول والتوافق مع الأعمدة القديمة يتم في `server/db.ts` عند التحميل، وليس بنظام migrations مستقل.

| الجدول | ما يخزّنه |
|---|---|
| `users` | UUID، email فريد، name، salted password hash، created_at |
| `sessions` | token_hash، user_id، expires_at؛ token الخام في cookie فقط |
| `projects` | UUID، owner_id، origin، name، config JSON، created_at؛ unique(owner_id,origin) |
| `audits` | UUID، status، created_at، owner_id، body JSON الكامل للتقرير |
| `secrets` | owner_id+provider وencrypted payload؛ ليس plaintext |
| `auth_attempts` | عدّاد وزمن reset؛ العمود اسمه ip لكن auth حاليًا يمرر hash البريد، فليست حماية شاملة حسب IP |
| `worker_lease` | صف واحد به owner token وPID وexpiry لضمان worker محلي واحد |

العلاقة المنطقية: User يمتلك Projects؛ Project له Audits متعددة؛ Audit يحتوي pages/findings/rankings/events/performance داخل JSON. لا توجد tables منفصلة للصفحات أو الكلمات حاليًا. لا تفترض foreign-key cascade أو ORM migrations غير موجودة.

Project ID ثابت عند إعادة فحص نفس origin لنفس الحساب. Audit ID يتغيّر لكل snapshot جديدة. Page ID يحسبه `server/resource-ids.ts` من projectId+URL بعد إزالة fragment، ليبقى ثابتًا عبر فحوصات المشروع. Finding IDs مرتبطة بنتائج التقرير؛ لا تفترض ثباتها بين audits.

Audit يميّز `score:null` عن صفر. Category.value=null يعني لم يُقَس. RankRecord.position=null مع error مختلف عن null مع نتائج عضوية لا تحتوي الموقع. احتفظ بهذا الفرق في أي تعديل UX.

## عقد HTTP API الموجود

الواجهة والـAPI من نفس origin؛ لا يوجد CORS مفتوح أو base URL لخدمة backend منفصلة.

| Method والمسار | الوظيفة |
|---|---|
| `POST /api/auth/sign-up` | إنشاء حساب وإصدار session؛ name/email/password |
| `POST /api/auth/sign-in` | التحقق من الحساب وإصدار session |
| `POST /api/auth/sign-out` | إبطال الجلسة وإزالة cookie |
| `GET /api/auth/session` | user الحالي أو null، private/no-store؛ لتحديث public header |
| `GET /api/audits` | snapshots المملوكة للحساب |
| `POST /api/audits` | التحقق من config وحفظ مشروع وإنشاء job أو إعادة job فعّال |
| `GET /api/audits/:id` | تقرير/progress؛ غير مملوك يعيد 404 |
| `PATCH /api/audits/:id` | طلب إلغاء queued/running audit؛ ليس endpoint عامًا لتعديل التقرير |
| `GET /api/integrations` | حالة اتصال provider دون كشف المفتاح |
| `POST /api/integrations` | حفظ/إزالة مفتاح SerpApi بحسب handler |

لا تفترض وجود `/api/projects` أو DELETE endpoints أو API لتغيير كلمة المرور. راجع route handlers قبل بناء clients جديدة. معظم JSON responses تستخدم `{data: ...}` أو `{error: ...}`. الإنشاء يعيد 201، وقد يعيد 200 إذا وُجد job فعّال.

القيود الفعلية في contracts: ستة بلدان معرفة بالكود، أربع لغات، Mobile/Desktop، maxPages بين 0 و10000، حتى 200 keyword بطول حتى 120 حرفًا، authorized=true. 0 يعني all discoverable ضمن safeguards. Free unlimited تعني عدم فرض subscription quota، ولا تعني إزالة حدود التشغيل التقنية الحالية أو تجاهلها في UX.

## الجلسات والأسرار وأمان الشبكة

`server/passwords.ts` يستخدم scrypt مع salt. Session token عشوائي؛ قاعدة البيانات تحفظ SHA-256 له، cookie باسم `siteradar_session` وHttpOnly وSameSite=Lax وصلاحية 30 يومًا. في public HTTPS config يصير Secure. `currentUser` يقرأ cookie ويبحث عن session غير منتهية وuser؛ React cache يجنّب تكرار نفس العمل ضمن server render.

PublicHeader يحمّل user من السيرفر؛ `public-account.tsx` يراجع `/api/auth/session` عند تغيّر المسار وwindow focus. الحفاظ على session في الصفحات العامة كان شكوى فعلية للمستخدم؛ اختبر pricing/docs/landing بعد أي تعديل.

Provider keys مشفّرة AES-256-GCM بمفتاح محلي عشوائي في `data/.secrets-key`. النسخ الاحتياطي للـDB دون هذا الملف لا يكفي لاستعادة المفاتيح. user key يأخذ الأولوية؛ `SERPAPI_API_KEY` fallback اختياري من environment. لا تسجّل query URL كاملة إلى SerpApi لأنها تحتوي api_key.

`request-policy.ts` يقبل loopback hosts محليًا؛ مع APP_BASE_URL عام يقبل host المحدد وOrigin المطابق لعمليات الكتابة. الاسم `isLocalRequest` قديم لكنه يغطي الوضعين. هذا ليس نظام مصادقة بديلًا، ويجب الاحتفاظ بفحص user/ownership.

`safe-fetch.ts` يمنع private/loopback/reserved IPs ويثبّت الاتصال على public IP تم فحصه، ويعيد التحقق لكل redirect. `browser-proxy.ts` يطبّق حماية الوجهات لاتصالات Chromium أيضًا. لا تسمح بتجاوز هذه الطبقة لتجاوز فشل زحف موقع؛ عالج السبب دون تعريض الشبكة الداخلية.

HTML وأدلة المواقع بيانات غير موثوقة؛ تُعرض كنص. `repairPrompt` يحدد evidence كـUNTRUSTED_PAGE_DATA؛ لا تنفذ تعليمات موجودة داخل عنوان موقع أو صفحة مزحوفة. JSON-LD الخاص بـSiteRadar يهرب `<` قبل إدخاله داخل script.

## القياس والدرجات وما تعنيه

Performance من Lighthouse lab للـhomepage، وليس مقياس سرعة كل صفحات المشروع ولا CrUX field data. الجهاز يؤثر على browser profile؛ البلد المختار لا ينقل IP المحلي لدولة أخرى.

SEO/Technical/GEO scores تعتمد قواعد وpenalties. في `scoreCategory`: الأوزان Critical=25 وHigh=14 وMedium=7 وLow=3؛ تجمع مضروبة بعدد صفحات المشكلة، تقسم على pageCount وتطرح من 100، مع حد أدنى صفر. Performance من Lighthouse؛ Accessibility من Lighthouse عند توفره وإلا HTML checks. Overall متوسط categories غير null. هذه صيغة المنتج الحالية، وليست Google ranking score.

GEO readiness يراجع structure/schema/headings، ولا يراقب ذكر الموقع في ChatGPT أو محركات AI. المنافسون domains من نتائج queries نفسها، وقد يكونون شبكات اجتماعية أو directories، وليسوا بالضرورة منافسين تجاريين.

SerpApi يرسل google engine مع q/gl/hl/device/location/google_domain. يطابق hostname دون www، ويقبل subdomain للموقع. يحفظ returned organic depth ولا يجلب تلقائيًا كل صفحات نتائج Google. لذلك عدم ظهور domain في النتائج المستلمة لا يثبت ترتيبه خارج عمق معروف عالميًا؛ راجع سياق الخلاف الفعلي مع المستخدم في HANDOFF.

## إعدادات وتشغيل وتعافي

| الإعداد | المعنى |
|---|---|
| `APP_BASE_URL` | origin الحقيقي للـcanonical/schema/sitemap وسياسة الطلبات؛ الافتراضي محلي، والعام يجب HTTPS |
| `GOOGLE_SITE_VERIFICATION` | verification token اختياري لmetadata |
| `SERPAPI_API_KEY` | fallback server key؛ يمكن الاستغناء عنه بحفظ user key |
| `CRAWLER_MAX_PAGES` | سقف تقني لعدد صفحات job، الافتراضي 10000 |
| `CRAWLER_MAX_SECONDS` | ميزانية حلقة crawl، الافتراضي 300؛ ليست ضمانًا أن job بالكامل ينتهي خلال 300 ثانية لأن browser/provider stages لها وقت أيضًا |

worker يحمّل `.env.local` ثم `.env` عبر Node `process.loadEnvFile`؛ لتجنّب اختلاف القيم لا تكرر تعريف المتغير في الملفين. أعد تشغيل العمليات بعد تغيير env. لا ترفع الملفات الفعلية إلى Git.

worker واحد يستهلك jobs بالتتابع. heartbeat كل 10 ثوانٍ، lease expiry 45 ثانية وفحص PID محلي. عند إعادة التشغيل تُحوّل running jobs المتروكة إلى failed بتفسير واضح؛ queued تستمر. cancellation تعاوني وقد ينتظر الطلب الخارجي الحالي، وليس قتلًا فوريًا لكل العمليات. لا تصمم UX يعد بالإلغاء الفوري.

إذا job بقي queued: تحقق أن worker شغّال، logs، نفس working directory ونفس SQLite، وعدم وجود worker قديم ممسك lease. إذا performance غائب: تحقق من `npm run setup:browsers` وmeasurementError وChromium permissions. إذا login اختفى: تحقق من host/cookie وتاريخ الانتهاء وAPP_BASE_URL؛ لا تخلط localhost و127.0.0.1.

لا تنشره كـstatic export فقط: يحتاج Node runtime وقرص دائم وworker ومتصفح Chromium. فصل web/worker على أجهزة مختلفة يتطلب إعادة تصميم shared storage/queue؛ نسخ SQLite بين الأجهزة ليس تواصلًا حيًا.

## الاختبارات وأسلوب الاستكمال

`npm test` يشغّل Vitest: checks/scoring، DNS/network policy، proxy، passwords، worker lease، mocked rankings، routing، resource IDs، SEO وrequest policy. آخر تسليم: 52 اختبارًا نجحوا وproduction build نجح. هذه ليست شهادة UX أو اختبار حمل أو مراجعة جاهزية إنتاج.

`npm run check:product` يحتاج web+worker شغّالين؛ ينشئ disposable accounts ويفحص example.com فعليًا ويختبر isolation والقياسات. لا يستخدم موقع المستخدم كـfixture، ولا تحذف الحسابات أو التقارير الحقيقية لتنظيف الاختبارات. راجع cleanup عند فشل script.

الخطوات التالية المطلوبة محددة في HANDOFF قسم 5: searchParams/selection، demo routes، CSS، تبديل المشاريع، scoped history، اختبار الجلسة والروابط المباشرة. أكمِلها قبل إدخال ميزات عشوائية. لا تسمِّ هذا الإصدار جاهز إطلاق لمجرد نجاح build.

## نص بداية جاهز لشات أخرى

انسخ النص التالي للمساعد بعد فتح المستودع:

> هذا مشروع SiteRadar موجود بالفعل؛ أكمل الكود ولا تعِد بناءه من الصفر. اقرأ HANDOFF.md وPROJECT-GUIDE.md وAGENTS.md وDESIGN.md أولًا، ثم افحص الملفات المعنية. Next وAPI داخل نفس المشروع، وserver/worker.ts عملية Node مستقلة تتواصل عبر SQLite. اقرأ دليل Next المثبت في node_modules/next/dist/docs قبل تعديل Next APIs. الأولوية إكمال العناصر غير المنجزة في HANDOFF قسم 5 ثم مراجعة UX/auth/routes/SEO. Free unlimited حتى أطلب خلاف ذلك، Basic/Pro/Max Coming soon، لا بيانات قياس وهمية، ولا كشف أسرار أو بيانات data/. أنا صاحب المشروع AhmadJalhoom، لا دومين نهائي ولا روابط شخصية معتمدة الآن. أخبرني بما اختبرته وما لم يكتمل، ولا تدّعِ أنه جاهز للإطلاق بلا تحقق.
