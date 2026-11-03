# SiteRadar — تسليم المشروع والاستكمال على Mac

آخر تحديث: 3 نوفمبر 2026. صاحب المشروع ومطوّره: **AhmadJalhoom**، Software Engineer.

هذا الملف نقطة البداية للمطوّر أو مساعد البرمجة على الجهاز الثاني. الكود الكامل موجود في المستودع؛ هذا الملف ينقل سياق المنتج، التشغيل، القرارات، وحالة العمل الفعلية. **المشروع لم يُنشر للإنتاج بعد، ولا يوجد دومين نهائي.**

## 1. البدء على الماك

ثبّت Git وNode.js **24.11 أو أحدث من إصدار 24** وnpm. لا تنقل `node_modules` أو `.next` من Windows؛ أعد تثبيتها على Mac، خصوصًا Chromium.

```bash
git clone https://github.com/AhmadJalhoom20/SiteRadar.git
cd SiteRadar
node --version
npm ci
npm run setup:browsers
cp .env.example .env.local
npm run dev
```

افتح `http://127.0.0.1:3000`. استخدم هذا العنوان باستمرار؛ `localhost` و`127.0.0.1` لهما cookies منفصلة. أنشئ حسابًا جديدًا إذا لم تنقل قاعدة البيانات. `npm run dev` يشغّل Next والـworker معًا؛ إبقاء الويب وحده لا ينفّذ الفحوصات.

Next يقرأ `.env.local`، والـworker يحمّل `.env.local` ثم `.env` عبر `process.loadEnvFile` في بداية تشغيله. الإعدادات الافتراضية تكفي محليًا؛ ويمكن ضبط القيم المشتركة في نفس terminal قبل التشغيل، مثل:

```bash
export APP_BASE_URL=http://127.0.0.1:3000
export CRAWLER_MAX_PAGES=10000
export CRAWLER_MAX_SECONDS=300
npm run dev
```

الأفضل إدخال SerpApi من Integrations بحسابك بدل وضع المفتاح في الكود. لا ترسل المفتاح في المحادثة.

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` يشغّل build الإنتاج الموجود والـworker. بعد clone جديد شغّل build قبل typecheck إذا ظهرت أخطاء عن أنواع routes مولّدة قديمة. تحذير SQLite التجريبي من Node معروف. لا تحتاج Python أو Docker أو PostgreSQL للتشغيل المحلي.

## 2. نقل الحسابات والتقارير الحالية اختياريًا

GitHub يحتوي الكود فقط. `data/` مستثنى لأنه يحتوي الحسابات، hashes كلمات المرور، جلسات الدخول، التقارير ومفاتيح مزوّد البحث المشفّرة. بدون نقله يبدأ Mac بقاعدة جديدة، وهذا طبيعي.

إذا أردت نفس بيانات Windows:

1. أوقف **كل** عمليات SiteRadar على الجهازين (الويب والـworker) قبل النسخ. لا تنسخ SQLite أثناء وجود عمليات كتابة.
2. انسخ مجلد `data/` كاملًا بوسيلة خاصة مثل USB أو نقل مشفّر؛ لا ترفعه إلى المستودع أو issue.
3. ضعه في جذر نسخة المشروع على الماك، قبل تشغيلها لأول مرة. إذا كان هناك `data/` على الماك احتفظ بنسخة احتياطية منه أولًا؛ لا تستبدله بلا مراجعة.
4. يجب نقل `data/.secrets-key` المخفي مع `siteradar.sqlite` وأي ملفات WAL/SHM الموجودة. فقدان المفتاح يمنع فك SerpApi المحفوظ. الملفات المخفية قد لا تظهر في Finder؛ استخدم Command+Shift+Period لعرضها.
5. قيّد صلاحيات البيانات على الماك: `chmod -R go-rwx data`. ابدأ التشغيل وسجّل الدخول بنفس الحساب. browser cookies لا تنتقل عبر Git، وقد تحتاج الدخول مجددًا.

لا تستخدم مجلدًا واحدًا عبر مشاركة شبكية لتشغيل worker على جهازين؛ lease مصمم لعمليات محلية. لا تحذف أو تعدّل بيانات المستخدم الحقيقية أثناء الاختبارات. إعدادات المتصفح المحلية مثل اسم workspace لا تنتقل مع SQLite.

## 3. المنتج واتجاهه

SiteRadar منتج فحص SEO/GEO للمواقع: صفحات، مشاكل وأدلتها، performance، accessibility، كلمات وترتيب، منافسين، سجل وتقارير، وrepair prompts قابلة للتصدير.

- التقنية المطلوبة: Next.js + Node.js + Tailwind + مكتبات مناسبة، TypeScript.
- التصميم المعتمد: light workspace دقيق، أخضر forest، جداول واضحة، نص مقروء، بلا قوالب AI العامة. حافظ على الهوية الموجودة.
- **Free unlimited حتى يطلب المالك خلاف ذلك**؛ Basic / Pro / Max جميعها Coming soon، لا شراء أو دفع.
- لا تخترع درجات أو ترتيب كلمات. الـdemo بيانات توضيحية مستقلة؛ التقارير الحقيقية فقط من القياس.
- احفظ رابط المشروع وإعداداته؛ Run again يعيد استخدامها بدل إدخال الرابط لكل فحص.
- Settings أسفل sidebar قابلة للوصول، typography واضحة، صفحات فعلية بدل كل التنقل داخل `/app`.
- المالك طلب ربط **AhmadJalhoom** كصاحب ومطوّر المشروع في المحتوى وSEO وkeywords. لا GitHub/LinkedIn أو روابط شخصية الآن، ولا دومين مختار. لا تخمّنها.

المواصفات الأصلية محفوظة في [docs/original-product-spec-ar.md](docs/original-product-spec-ar.md). هذه مرجع للمتطلبات، وليست دليلًا أن كل ما فيها منفّذ. تفاصيل الحالة هنا تتقدّم على ادعاءات المستندات الأقدم.

## 4. ما هو موجود

- Landing، Pricing، docs قابلة للبحث ومقالات، sign-up / sign-in / sign-out، About وصفحة AhmadJalhoom.
- حسابات SQLite، كلمات مرور scrypt، جلسات tokens مخزنة hashed وHttpOnly cookies، owner-scoped reports/API.
- مشاريع محفوظة وإعداداتها، queue دائم للفحوصات، progress/cancel/polling، worker واحد بlease وheartbeat.
- زحف public HTTPS لنفس origin مع robots.txt، حماية private-network وDNS/redirects، Chromium عبر proxy يتحقق من الوجهات.
- فحوص HTML، أدلة المشاكل، صفحات، تصنيفات ودرجات محسوبة من المصادر المتاحة.
- Lighthouse وaxe **للصفحة الرئيسية**، mobile/desktop، LCP/CLS/TBT/FCP/Speed Index، charts من القياسات الفعلية.
- SerpApi اختياري: key مشفّر AES-GCM، keywords محفوظة، سياق البلد واللغة والجهاز، النتائج الخام القابلة للعرض ومنافسون من نفس نتائج البحث.
- JSON/CSV، الطباعة PDF من المتصفح، repair prompt Markdown والنسخ.
- Routes جديدة للمشاريع والفحوصات، IDs ثابتة للصفحات، تفاصيل issues/pages، metadata/JSON-LD وsitemap/robots وOG image.
- PublicHeader يقرأ الجلسة من السيرفر ويحدّثها عبر `/api/auth/session` عند التنقل/focus، وCTA تختلف عند تسجيل الدخول.

## 5. آخر تعديل غير مكتمل — ابدأ هنا

المستخدم طلب نقل الشغل إلى Mac أثناء تنفيذ مراجعة UX/SEO/routes. **الـbuild يمر، لكن هذا لا يعني أن مراجعة الإطلاق اكتملت.**

1. `app/app/[[...segments]]/page.tsx`: تمرير `searchParams` إلى Workspace غير مكتمل. `initialSelected` و`initialFilters` موجودة في Workspace لكن السيرفر لا يمرّرها بعد. اقرأ `issues`, `category`, `search`؛ تحقق من finding IDs داخل التقرير المحدد. هذا ضروري لزر إضافة مشاكل إلى Fix prompt وللفلاتر بالرابط.
2. Workspace يبني روابط `/demo/...`، بينما يوجد حاليًا `app/demo/page.tsx` فقط؛ روابط demo الفرعية تحتاج catch-all يستعمل example data فقط، أو تعديل الروابط. لا تعرض بيانات الحسابات في demo.
3. CSS للمكوّنات الجديدة: `public-account`, founder/about و`resource-details` يحتاج مراجعة؛ كذلك selectors القديمة `>button` للمشروع/history بعدما صارت Links.
4. راجع تبديل audit/project وإعادة تحميل URL: لا تعتمد على آخر audit في localStorage. قد يلزم key على Workspace حسب audit ID أو مزامنة state. `savedProjects` prop مُمرّر وغير مستعمل حاليًا؛ المشاريع بدون audit تحتاج UX واضحًا. History ينبغي عرضه ضمن المشروع عند العمل في scope مشروع.
5. أكمِل اختبار signed-in header على landing/pricing/docs، الروابط المباشرة وإعادة التحميل، منع وصول مستخدم لتقرير/صفحة/finding مستخدم آخر، و404 للـIDs الغلط. `scripts/check-product.mjs` أقدم من تعديلات routing الأخيرة ويحتاج توسيعًا؛ ينشئ حسابات اختبار وفحصًا حقيقيًا لـexample.com، لذلك شغّله بوعي.
6. `scripts/route-workspace.mjs` أداة تحويل **استُخدمت بالفعل** وليست أمر setup. لا تعد تشغيلها، فهي تتوقع الكود القديم ويمكن حذفها بعد مراجعة التحويل.
7. README/STATUS/PRODUCT/ARCHITECTURE فيها نصوص تاريخية أقدم (مثل single-user أو استيراد reports عند signup أو عدم اختبار SerpApi). لا تعتمد عليها بدل هذا التسليم؛ حدّثها مع اكتمال المراجعة. استيراد تقارير قديمة غير مملوكة عبر signup تم تعطيله، وhelper `importLegacy` ما زال في db للمراجعة الإدارية فقط.
8. إعداد public domain policy وSecure cookie موجود، لكنه تمهيد للنشر وليس اعتماد جاهزية إنتاج. اختبر reverse proxy وHTTPS وHost/Origin قبل النشر.

## 6. مشكلة ترتيب الكلمات وسياقها

المستخدم فحص `ahmedsaleh.website`، والكلمات تتضمن `ahmad saleh layaqa`. لقطة Google عنده تعرض موقعه أولًا، بينما استجابة SerpApi المحفوظة لم تتضمن موقعه في 8–10 نتائج عضوية.

تم التحقق فعليًا من SerpApi؛ الفرق كان موجودًا في النتائج المستلمة، وليس إثباتًا أن موقعه غير مرتب عالميًا، ولم يُحسم سبب اختلاف بحثه الشخصي عن provider. لا تقل له ببساطة إنه غير مرتب، ولا تُدخل رقم 1 من الصورة كقياس provider.

أضفنا سياق location صريحًا وgoogle.com وأدلة النتائج وحالات أوضح، مع tests لمطابقة www والروابط الفرعية. context يحفظ requestedLocation/locationUsed/queryDisplayed/spellingSuggestion/resultState. لا تفرض تصحيح spelling تلقائيًا، ولا تصرف استعلامات SerpApi إضافية بلا حاجة. المفتاح موجود في بيانات الجهاز فقط.

## 7. خريطة الملفات

| المسار | المسؤولية |
|---|---|
| `app/` | Next App Router، public/private pages وAPI |
| `app/app/[[...segments]]/page.tsx` | routing، تحميل بيانات الحساب والتحقق من ملكية الموارد |
| `components/workspace.tsx` | workspace والتقارير والتنقل؛ ملف كبير يحتاج تغييرات حذرة |
| `components/resource-details.tsx` | تفاصيل الصفحة والمشكلة |
| `components/public-shell.tsx`, `public-account.tsx` | الهيدر والفوتر وحالة الجلسة العامة |
| `components/live-keywords.tsx`, `live-competitors.tsx` | ترتيب وأدلة provider |
| `app/globals.css`, `app/product.css`, `DESIGN.md` | الهوية والتنسيقات |
| `lib/types.ts`, `workspace-routes.ts` | العقود والـroutes |
| `lib/site.ts`, `seo.ts`, `components/json-ld.tsx` | domain config، المؤسس وmetadata/schema |
| `lib/example.ts` | demo فقط |
| `server/db.ts`, `auth.ts`, `passwords.ts`, `secrets.ts` | البيانات والحسابات والأسرار |
| `server/worker.ts`, `worker-lease.ts` | تنفيذ queue وحماية تعدد workers |
| `server/browser-audit.ts`, `browser-proxy.ts`, `safe-fetch.ts` | Chromium/Lighthouse/axe وأمان الشبكة |
| `server/checks.ts`, `contracts.ts`, `rankings.ts` | قواعد الفحص والتحقق وSerpApi |
| `scripts/check-product.mjs` | اختبار تكاملي محلي ينشئ فحصًا حقيقيًا |

الروابط: `/app/projects`، `/app/projects/:projectId[/issues|pages|performance|keywords|competitors|fix-prompt|audits]`، و`/app/audits/:auditId` بنفس الأقسام. التفاصيل `/pages/:pageId` و`/issues/:findingId`. الإعدادات `/app/settings` و`/app/settings/integrations`. `/app` يوجّه للمشاريع. السيرفر يتحقق من ملكية الموارد قبل عرضها.

## 8. SEO والدومين

لا يوجد دومين. `APP_BASE_URL` يبقى محليًا الآن. `lib/site.ts` يرفض public HTTP أو path/credentials داخل origin. عند اختيار الدومين استخدم HTTPS origin فقط (مثل `https://your-domain.com`) وشغّل build جديدًا؛ robots/metadata/OG/sitemap تعتمد عليه.

أُضيفت keywords تشمل AhmadJalhoom، محتوى ظاهر عن المؤسس، Person/Organization/SoftwareApplication/WebSite وProfilePage JSON-LD، canonical وOG/Twitter metadata وnoindex للخاص/auth. Google لا يستخدم meta keywords لترتيب البحث؛ لا ضمان لظهور الاسم أو توقيته. لا structured data وهمية مثل ratings أو sameAs غير موثّق.

في الوضع المحلي robots يمنع الزحف وsitemap فارغ. بعد الدومين: راجع canonical/sitemap/robots من الموقع المنشور، أضف Search Console verification إن توفّر، وقدّم sitemap. لا تعتبر فهرسة الموقع أو ربط الهوية منجزًا قبل النشر والتحقق.

## 9. حدود الإطلاق

الموجود implementation محلي مفيد، وليس تنفيذًا كاملًا لكل المواصفات الأصلية. قبل فتح التسجيل للعامة راجع HTTPS/reverse proxy، حدود الموارد والطلبات، تشغيل Chromium بعزل مناسب، backups واستعادتها، logging/monitoring، سياسة خصوصية وشروط، email verification/password recovery، وملكية المواقع وحدود إساءة الاستخدام.

لا مدفوعات، فرق، مشاركة عامة، scheduling، Search Console، field/CrUX data، قياس ظهور فعلي داخل AI answers، أو تعريب كامل. GEO heuristics ليست قياس رؤية داخل نماذج AI؛ TBT ليس INP؛ axe ليس شهادة WCAG كاملة. PostgreSQL/Redis/object storage قرار توسّع لاحق، وليس شرطًا لتشغيل Mac محليًا.

## 10. التحقق عند التسليم

- `npm test`: **52 اختبارًا، 10 ملفات، كلها نجحت** بتاريخ التسليم.
- `npm run build`: **نجح** مع compile وTypeScript وتوليد الصفحات بعد تعديلات routes/SEO.
- لم يُعَد تشغيل اختبار التكامل بالكامل بعد آخر تغييرات routes.
- مراجعة المتصفح المرئية لتعديلات هذه الجولة لم تتم؛ إذن فتح المعاينة رُفض سابقًا، فلم يُستخدم مسار بديل. على الماك يمكن طلب مراجعة تفاعلية بإذن جديد.
- لم يتم نشر الموقع أو اختيار دومين أو إعداد حسابات اجتماعية.

## 11. تعليمات الاستكمال للمساعد على Mac

للشرح التقني التفصيلي اقرأ أيضًا [PROJECT-GUIDE.md](PROJECT-GUIDE.md): العمليات، المكتبات، قاعدة البيانات، دورة الفحص، API، وأماكن التعديل. هذا الملف يركّز على التسليم والحالة المتبقية؛ الدليل الآخر يشرح كيف يعمل الكود.

اقرأ هذا الملف ثم `AGENTS.md` و`DESIGN.md` والكود المعني. Next هنا **16.4.4** بواجهات متغيرة؛ اقرأ الدليل المناسب في `node_modules/next/dist/docs/` قبل كتابة Next code. ثبت نسخ `package-lock.json` عبر `npm ci`، ولا تحدّث كل المكتبات اعتباطيًا.

ابدأ بقائمة القسم 5، ثم اختبر الحسابات والروابط والـresponsive UX. حافظ على Free unlimited، حفظ إعدادات المشاريع، صدق القياسات، وبيانات المستخدم. لا تعيد بناء المنتج من الصفر ولا تملأ الفراغات بأرقام demo. لا تنشر بيانات `data/` أو `.env.local` أو API keys. لا تدّعِ جاهزية الإطلاق اعتمادًا على build وحده.
