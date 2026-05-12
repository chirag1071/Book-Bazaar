import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { API_BASE } from '../../utils/api';
import './BookDetailPage.css';

function BookDetailPage({ onAddToCart, wishlist = [], toggleWishlist, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]); // For related books
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentPage, setCurrentPage] = useState(1);

  const isWishlisted = Boolean(
    book && 
    (book._id || book.id) && 
    wishlist.some(item => (item._id && item._id === book._id) || (item.id && item.id === book.id))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookData, allBooks] = await Promise.all([
          api.get(`/api/book/${id}`),
          api.get('/api/book/all')
        ]);
        setBook(bookData.book);
        setBooks(allBooks.books || []);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="detail-page" style={{display: 'flex', justifyContent: 'center', padding: '100px'}}>
      <div className="loader">Loading book details...</div>
    </div>
  );

  if (!book || book.message === "Not Found") {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="not-found">
            <span>📭</span>
            <h2>Book Not Found</h2>
            <Link to="/books" className="btn-primary">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating = 0) => {
    const stars = [];
    const val = parseFloat(rating) || 0;
    const full = Math.floor(val);
    const half = (val % 1) >= 0.5;
    for (let i = 0; i < full; i++) stars.push('★');
    if (half) stars.push('★');
    while (stars.length < 5) stars.push('☆');
    return stars.join('');
  };

  const relatedBooks = books.filter(b => (b.category?.toLowerCase() === book.category?.toLowerCase()) && (b._id !== book._id)).slice(0, 3);
  const totalPages = 200 + (parseInt((book._id || "0").slice(-4), 16) % 300);

  const generateStructuredNarrative = (page) => {
    const title = book.title || 'This Book';
    const author = book.author || 'The Author';
    const desc = book.description || 'a fascinating journey into the unknown';
    
    const getGujaratiTranslation = (text) => {
      if (!text) return '';
      const map = {
        'Thinking, Fast and Slow': 'વિચારવું, ઝડપી અને ધીમું',
        'Atomic Habits': 'અણુ આદતો',
        'Project Hail Mary': 'પ્રોજેક્ટ હેલ મેરી',
        'The Alchemist': 'આલ્કેમિસ્ટ',
        'Ikigai': 'ઇકિગાઇ',
        'Something Wicked This Way Comes': 'કંઈક દુષ્ટ આ રીતે આવે છે',
        'Dune': 'ડ્યુન',
        "Man's Search for Meaning": "જીવનના અર્થની શોધ",
        "Viktor E. Frankl": "વિક્ટર ફ્રેન્કલ",
        "Daniel Kahneman": "ડેનિયલ કાહનેમેન",
        "James Clear": "જેમ્સ ક્લિયર",
        "Andy Weir": "એન્ડી વીર",
        "Paulo Coelho": "પાઉલો કોએલ્હો",
        "Hector Garcia": "હેક્ટર ગાર્સિયા",
        "Ray Bradbury": "રે બ્રેડબરી",
        "Frank Herbert": "ફ્રેન્ક હર્બર્ટ",
        "Unknown Author": "અજ્ઞાત લેખક",
        "The Author": "લેખક"
      };
      return map[text] || text;
    };

    const gujTitle = language === 'Gujarati' ? getGujaratiTranslation(title) : title;
    const gujAuthor = language === 'Gujarati' ? getGujaratiTranslation(author) : author;

    // Distinct seeded random function based on page number to ensure text is consistent per page but distinct per part
    const baseSeed = page * (book._id ? book._id.charCodeAt(0) : 1);
    const getRand = (max, salt) => Math.floor(Math.abs(Math.sin(baseSeed + salt) * 10000)) % max;

    const cat = (book.category || '').toLowerCase();
    
    const engSentences = {
      psychology: {
        starts: [`Welcome to the deep exploration found in ${title}.`, `In ${title}, ${author} unravels the complexities of the human mind.`, `Drawing upon early research, ${author} begins to map out our cognitive biases.`, `The essence of ${title} lies in understanding our behavioral patterns.`, `As we delve deeper, ${author}'s theories on mental habits become increasingly relevant.`],
        mids1: [`The concepts challenge our traditional understanding of logic.`, `Here, ${author} introduces the idea that our environment shapes our intuition.`, `This perspective forces us to reconsider the way we make daily decisions.`, `By examining these mental shortcuts, a new framework of thought emerges.`, `These observations are backed by years of psychological study and rigorous trials.`],
        mids2: [`Moreover, ${author} highlights the profound impact of subconscious habits.`, `The significance of this cannot be overstated in modern psychology.`, `It becomes clear how easily our perception can be manipulated.`, `Interestingly, similar patterns are observed across different cultures and age groups.`, `This realization is often the first step toward meaningful personal growth.`],
        ends: [`Ultimately, ${title} serves as a guide to mastering one's own intellect.`, `These insights remain central to ${author}'s vision of human potential.`, `The journey through these concepts is both challenging and incredibly rewarding.`, `Thus, the groundwork is laid for the transformative ideas yet to come.`, `Readers are left to ponder the hidden forces driving their everyday lives.`]
      },
      fiction: {
        starts: [`Within the imaginative world of ${title}, the silence was eventually broken.`, `The atmosphere in ${title} was thick with an unspoken anticipation.`, `As the narrative of ${title} unfolds, ${author} paints a vivid picture of the surroundings.`, `It was a time of great uncertainty, a theme heavily explored by ${author}.`, `${author} masterfully sets the stage for what would become an unforgettable encounter.`],
        mids1: [`Shadows danced across the walls, mirroring the internal conflict of the protagonist.`, `A sudden shift in the wind signaled that things would never be the same.`, `The characters navigated through extreme trials that tested their absolute resolve.`, `In a world where danger lurked in every corner, hope was a dangerous luxury.`, `Every step forward felt like crossing a threshold into the great unknown.`],
        mids2: [`Behind their calm exterior, a storm of emotions was steadily brewing.`, `The unexpected revelation forced them to question everything they once believed.`, `Even as the tension mounted, a strange sense of clarity began to set in.`, `They knew that the choices made here would echo throughout eternity.`, `The vivid imagery crafted here immerses the reader completely into the scene.`],
        ends: [`As the chapter progresses, ${title} solidifies its place as a gripping tale.`, `This moment of suspense is characteristic of ${author}'s brilliant storytelling.`, `Little did they know, this was only the beginning of their true journey.`, `The fading light marked the end of an era and the dawn of a new struggle.`, `It is this very tension that keeps the pages turning relentlessly.`]
      },
      general: {
        starts: [`Welcome to the engaging journey of ${title}. ${desc}`, `In ${title}, ${author} presents a compelling narrative that captivates from the start.`, `The core premise of ${title} revolves around understanding profound life concepts.`, `As ${author} outlines the foundational ideas, the importance of this work becomes evident.`, `Diving into the text, ${desc} sets a clear tone for the reader.`],
        mids1: [`The underlying themes challenge conventions and introduce fresh perspectives.`, `This brings to light several intriguing questions about our society and values.`, `By weaving together factual observations and thoughtful commentary, the point is made clear.`, `The structural flow of the narrative ensures that each argument is thoroughly explored.`, `It is fascinating to see how these seemingly disparate ideas begin to connect.`],
        mids2: [`Furthermore, the historical context provided adds a necessary layer of depth.`, `Such profound insights are rare, making the reading experience truly exceptional.`, `The eloquence with which these thoughts are expressed is highly commendable.`, `Readers often find themselves pausing to reflect on the gravity of these statements.`, `The pacing continues to build, driving the core message home with great efficacy.`],
        ends: [`Ultimately, the lessons drawn from ${title} have a lasting, transformative effect.`, `This careful examination is what makes ${author}'s work stand out significantly.`, `As we conclude this thought, the transition to the next profound idea feels natural.`, `It stands as a testament to the enduring power of well-articulated knowledge.`, `The wisdom imparted here resonates long after the final word is read.`]
      }
    };

    const gujSentences = {
      psychology: {
        starts: [`${gujTitle} માં માનવ મનના ઊંડા રહસ્યોનું અદભૂત વર્ણન કરવામાં આવ્યું છે.`, `અહીં, ${gujAuthor} આપણી આદતો અને વિચારો વિશે નવો દ્રષ્ટિકોણ આપે છે.`, `${gujTitle} ની શરૂઆતથી જ, લેખક મનોવિજ્ઞાનના મહત્વના તથ્યો પર પ્રકાશ પાડે છે.`, `${gujTitle} નું મુખ્ય કેન્દ્ર આપણા વર્તન અને માનસિકતાને સમજવાનું છે.`, `${gujAuthor} ના આ વિચારો વ્યક્તિગત વિકાસ માટે ખૂબ જ મહત્વપૂર્ણ સાબિત થાય છે.`],
        mids1: [`આ ખ્યાલો આપણી પરંપરાગત સમજણને એક મોટો પડકાર ફેંકે છે.`, `તે સ્પષ્ટ કરે છે કે આપણું મન કઈ રીતે નિર્ણયો લે છે અને કાર્ય કરે છે.`, `આપણા રોજિંદા જીવનમાં આ માનસિક પ્રક્રિયાઓ કેટલી અસર કરે છે તે જોવા મળે છે.`, `લાંબા અભ્યાસ અને સંશોધન પછી, આ સિદ્ધાંતોને સરળ ભાષામાં સમજાવવામાં આવ્યા છે.`, `મન વારંવાર જે ભૂલો કરે છે, તે અંગે અહીં એક નવી વિચારધારા રજૂ થઈ છે.`],
        mids2: [`માનસિકતા વિશેના આ વિચારો જીવનમાં ખરેખર ખૂબ જ ઉપયોગી અને વ્યવહારુ છે.`, `તે જોવું રસપ્રદ છે કે કેવી રીતે નાની આદતો આપણા ભવિષ્યનું નિર્માણ કરે છે.`, `વાચકો મોટાભાગે આ વિગતો પોતપોતાના જીવન સાથે જોડીને ઊંડો વિચાર કરે છે.`, `આ ધીમી પણ અત્યંત અસરકારક અને સચોટ શીખ છે જે લાંબો સમય ટકી રહે છે.`, `વિવિધ ઉદાહરણો દ્વારા આ વાતને વધુ સ્પષ્ટ અને સચોટ બનાવવામાં આવી છે.`],
        ends: [`આખરે, ${gujTitle} આપણને આપણા જ મનને સમજવાની એક નવી દિશા આપે છે.`, `આ જ કારણ છે કે ${gujAuthor} નું આ પુસ્તક આટલું બધું લોકપ્રિય અને પ્રભાવશાળી છે.`, `આગળ વાંચતા, આ વિષય વધુ સ્પષ્ટ થાય છે અને નવા રસ્તાઓ ખુલે છે.`, `આ ઊંડા વિચારો જીવનમાં સકારાત્મક અને મોટો બદલાવ લાવવાની ક્ષમતા ધરાવે છે.`, `આ માહિતીનો અભ્યાસ કરવાથી માનસિક શાંતિ અને નવી ઊર્જા પ્રાપ્ત થાય છે.`]
      },
      fiction: {
        starts: [`${gujTitle} ની અદભૂત અને કાલ્પનિક દુનિયામાં વાર્તા એક નવો જ વળાંક લે છે.`, `આ કાલ્પનિક કથામાં, ${gujAuthor} એ રોમાંચ અને સસ્પેન્સનું સુંદર વર્ણન કર્યું છે.`, `વાર્તાના આ તબક્કે પાત્રો એક સાવ નવી અને અણધારી મુશ્કેલીનો સામનો કરે છે.`, `${gujTitle} નું રહસ્યમય વાતાવરણ વાચકોને શરૂઆતથી જ જકડી રાખવામાં સફળ રહે છે.`, `${gujAuthor} ની અદભૂત કલ્પનાશક્તિ આ કથાને જીવંત અને અત્યંત રસપ્રદ બનાવે છે.`],
        mids1: [`વાર્તા આગળ વધતા, ચારો તરફ એક અજીબ શાંતિ અને ડરનો માહોલ છવાઈ જાય છે.`, `પાત્રોનો આંતરિક સંઘર્ષ અને તેમની યાત્રા એકદમ રોમાંચક અને જીવંત અનુભવ કરાવે છે.`, `દરેક નવો વળાંક કથામાં વધારાનું રહસ્ય અને અણધારી ઉત્તેજના ઉમેરતો જાય છે.`, `જીવન અને મૃત્યુ વચ્ચે ઝોલા ખાતી આ વાર્તા હચમચાવી નાખે તેવી છે.`, `લેખક ઘટનાઓનું એટલી બારીકાઈથી વર્ણન કરે છે કે વાચક તેમાં સંપૂર્ણપણે ખોવાઈ જાય છે.`],
        mids2: [`આ મુશ્કેલ સમયમાં પણ આશાનું એક નાનું કિરણ તેમને આગળ વધવાની પ્રેરણા આપે છે.`, `રહસ્યો અને સાહસની તીવ્ર લાગણી વાર્તાની દરેક લીટીમાં સ્પષ્ટપણે અનુભવી શકાય છે.`, `તે વિચારવું રસપ્રદ છે કે લેખકે આ આખી અદભૂત દુનિયાનું નિર્માણ કેટલી કુશળતાથી કર્યું છે.`, `તેમના દરેક નિર્ણયની અસર આખી વાર્તા પર અને બીજા પાત્રો પર પડે છે.`, `અકલ્પનીય ઘટનાઓ વાર્તાને એવી રીતે આગળ વધારે છે જેની કોઈએ અપેક્ષા નહોતી રાખી.`],
        ends: [`આ કથાની ગતિવિધિઓ વાંચવી એ ખરેખર એક યાદગાર અને રોમાંચક અનુભવ છે.`, `આગળ શું થશે તે જાણવાની ઉત્કંઠાને લીધે વાચક આખું પુસ્તક વાંચવા મજબૂર થાય છે.`, `આ રહસ્યોનો ઉકેલ લાવવાની મુસાફરી હજુ તો માત્ર શરૂ જ થઈ છે.`, `આ જ અટકળો અને રોમાંચ ${gujAuthor} ની કથા કહેવાની શ્રેષ્ઠ શૈલીની ઓળખ છે.`, `અંતે, આ વાર્તા સાહસ અને માનવીય સંબંધોનો એક સુંદર અને જટિલ ચિતાર આપે છે.`]
      },
      general: {
        starts: [`${gujTitle} ના આ પ્રકરણમાં તમારું સ્વાગત છે. અહીં, ${gujAuthor} મહત્વના વિચારો રજૂ કરે છે.`, `${gujTitle} માં, લેખક દ્રારા રજૂ કરાયેલા અદભૂત વિચારો આપણી સમજને ખરેખર પડકારે છે.`, `આ યાત્રા શરૂ કરતા પહેલાં, ${gujAuthor} ના મુખ્ય સિદ્ધાંતો સમજવા ખૂબ જ જરૂરી છે.`, `${gujTitle} નું મુખ્ય લક્ષ્ય સમાજ અને જીવનના મહત્વપૂર્ણ પાસાઓ પર ધ્યાન દોરવાનું છે.`, `જેમ જેમ લખાણ આગળ વધે છે, તેમ તેમ વિષય વસ્તુ વધુ ઘેરી અને અર્થપૂર્ણ થતી જાય છે.`],
        mids1: [`આ માહિતી આપણને જીવન વિશે એકદમ નવો અને સકારાત્મક દ્રષ્ટિકોણ પ્રદાન કરે છે.`, `ઇતિહાસ અને વર્તમાન પરિસ્થિતિનો આ ઊંડો તાગ વાચકો માટે બોધપાઠ સમાન છે.`, `આ હકીકતો દરેક વ્યક્તિએ પોતાના જીવનમાં ઉતારવા જેવી અને સમજવા જેવી છે.`, `લેખકે સામાજિક અને વ્યવહારિક બાબતોને અત્યંત વ્યવસ્થિત રીતે આવરી લીધી છે.`, `આ અભિગમ વિચારવાની જૂની પ્રક્રિયાને બદલીને એક નવી અને આધુનિક વિચારધારા આપે છે.`],
        mids2: [`વધુમાં, આ વિચારોની અસર ખરેખર ઘણી મોટી, વ્યાપક અને અસરકારક છે.`, `અત્યાર સુધી જોતાં, આ લખાણમાં રહેલી ઊંડાઈ અને તેની ગંભીરતા આપણે સહેલાઇથી સમજી શકીએ છીએ.`, `તે વિચારવું ખૂબ રસપ્રદ છે કે આવી સચોટ માહિતી લેખકે કેટલી મહેનતથી એકત્રિત કરી હશે.`, `આ સત્ય હકીકતો અને સંઘર્ષની કથાઓ વિશે વિચારીને વાસ્તવિકતા વધુ સારી રીતે સમજાય છે.`, `લખાણની ગતિ અને તેની સરળતા દરેક વિગતને મહત્વપૂર્ણ અને સ્પષ્ટ બનાવે છે.`],
        ends: [`વાચકો અહી વારંવાર આ માહિતીનો અભ્યાસ કરવા અને તેના ઊંડા અર્થને સમજવા માટે રોકાઈ જાય છે.`, `આ જ કારણ છે કે ${gujAuthor} નું આ કામ આજના સમયમાં આટલું બધું લોકપ્રિય છે.`, `આગળ વાંચતા, પુસ્તકનો મુખ્ય હેતુ વધુ સ્પષ્ટ થતો જાય છે અને જ્ઞાન વધે છે.`, `આ ઐતિહાસિક અને સામાજિક લખાણ એક અત્યંત શક્તિશાળી અને પ્રોત્સાહક સંદેશ આપે છે.`, `આગળના પ્રકરણોમાં હજુ પણ વધુ અદભૂત અને મહત્વની માહિતી વાંચવા મળશે.`]
      }
    };

    const hinSentences = {
      starts: [`${title} की दुनिया में आपका स्वागत है। यहां हम एक नई यात्रा की शुरुआत करते हैं।`, `${author} के विचार हमें गहराई से सोचने पर मजबूर करते हैं।`, `इस कहानी की शुरुआत से ही एक अनोखा एहसास होता है।`, `पाठकों को इस पुस्तक के मुख्य विषय को समझना जरूरी है।`, `जैसे-जैसे हम आगे बढ़ते हैं, कहानी और भी दिलचस्प होती जाती है।`],
      mids1: [`यह जानकारी हमें जीवन के बारे में एक नया और सकारात्मक दृष्टिकोण प्रदान करती है।`, `इतिहास और वर्तमान स्थिति हमारे लिए एक महत्वपूर्ण सबक है।`, `ये तथ्य हर किसी को अपने जीवन में शामिल करने चाहिए।`, `इसे बहुत ही व्यवस्थित तरीके से कवर किया गया है।`, `यह दृष्टिकोण सोचने की प्रक्रिया को बदलकर एक नई विचारधारा देता है।`],
      mids2: [`इसके अलावा, इन विचारों का प्रभाव वास्तव में बहुत बड़ा, व्यापक और प्रभावी है।`, `अब तक देखते हुए, हम इस पाठ की गहराई और गंभीरता को आसानी से समझ सकते हैं।`, `यह सोचना बहुत दिलचस्प है कि लेखक ने कितनी मेहनत से इस सटीक जानकारी को एकत्र किया होगा।`, `इन सच्ची कहानियों के बारे में सोचकर, हम वास्तविकता को बेहतर ढंग से समझ सकते हैं।`, `लेखन की गति और सादगी हर विस्तार को महत्वपूर्ण और स्पष्ट बनाती है।`],
      ends: [`पाठक अक्सर इस जानकारी का अध्ययन करने और इसके गहरे अर्थ को समझने के लिए रुकते हैं।`, `यही कारण है कि आज के समय में ${author} का यह कार्य इतना लोकप्रिय है।`, `आगे पढ़ने पर, पुस्तक का मुख्य उद्देश्य और अधिक स्पष्ट हो जाता है और ज्ञान बढ़ता है।`, `यह पाठ एक बहुत शक्तिशाली और उत्साहजनक संदेश देता है।`, `अगले अध्यायों में पढ़ने के लिए और भी अद्भुत और महत्वपूर्ण जानकारी होगी।`]
    };

    const marSentences = {
      starts: [`${title} च्या जगात आपले स्वागत आहे. येथे आपण एका नवीन प्रवासाला सुरुवात करत आहोत.`, `${author} चे विचार आपल्याला खोलवर विचार करण्यास भाग पाडतात.`, `कथेच्या सुरुवातीपासूनच एक वेगळीच अनुभूती मिळते.`, `वाचकांनी या पुस्तकाचा मुख्य विषय समजून घेणे महत्त्वाचे आहे.`, `जसजसे आपण पुढे जातो तसतशी कथा अधिक रंजक होत जाते.`],
      mids1: [`ही माहिती आपल्याला जीवनाबद्दल एक नवीन आणि सकारात्मक दृष्टीकोन देते.`, `इतिहास आणि सद्यस्थिती आपल्यासाठी एक महत्त्वाचा धडा आहे.`, `प्रत्येकाने या गोष्टी आपल्या आयुष्यात समाविष्ट केल्या पाहिजेत.`, `हे अतिशय पद्धतशीरपणे कव्हर केले गेले आहे.`, `हा दृष्टिकोन विचार करण्याची प्रक्रिया बदलतो आणि नवीन विचारसरणी देतो.`],
      mids2: [`शिवाय, या विचारांचा प्रभाव खरोखरच प्रचंड, व्यापक आणि प्रभावी आहे.`, `आतापर्यंत पाहता, या मजकुराची खोली आणि गांभीर्य आपण सहज समजू शकतो.`, `लेखकाने किती कष्ट घेऊन ही अचूक माहिती गोळा केली असेल याचा विचार करणे खूप रंजक आहे.`, `या सत्यकथांचा विचार करून आपण वास्तव अधिक चांगल्या प्रकारे समजू शकतो.`, `लेखनाची गती आणि साधेपणा प्रत्येक तपशील महत्त्वपूर्ण आणि स्पष्ट बनवते.`],
      ends: [`वाचक अनेकदा या माहितीचा अभ्यास करण्यासाठी आणि तिचा सखोल अर्थ समजून घेण्यासाठी थांबतात.`, `याच कारणामुळे आजच्या काळात ${author} चे हे काम इतके लोकप्रिय आहे.`, `पुढे वाचताना, पुस्तकाचा मुख्य उद्देश अधिक स्पष्ट होतो आणि ज्ञान वाढते.`, `हा मजकूर अत्यंत शक्तिशाली आणि उत्साहवर्धक संदेश देतो.`, `पुढील प्रकरणांमध्ये वाचण्यासाठी आणखी आश्चर्यकारक आणि महत्त्वपूर्ण माहिती असेल.`]
    };

    const buildParagraphs = (pool) => {
      const idx1 = getRand(pool.starts.length, 1);
      const idx2 = getRand(pool.mids1.length, 2);
      const idx3 = getRand(pool.mids2.length, 3);
      const idx4 = getRand(pool.ends.length, 4);

      let idx5 = getRand(pool.starts.length, 5);
      if (idx5 === idx1) idx5 = (idx5 + 1) % pool.starts.length;
      let idx6 = getRand(pool.mids1.length, 6);
      if (idx6 === idx2) idx6 = (idx6 + 1) % pool.mids1.length;
      let idx7 = getRand(pool.mids2.length, 7);
      if (idx7 === idx3) idx7 = (idx7 + 1) % pool.mids2.length;
      let idx8 = getRand(pool.ends.length, 8);
      if (idx8 === idx4) idx8 = (idx8 + 1) % pool.ends.length;

      const p1_text = `${pool.starts[idx1]} ${pool.mids1[idx2]}`;
      const p2_text = `${pool.mids2[idx7]} ${pool.ends[idx8]}`;
      
      return [p1_text, p2_text];
    };

    const sectionHeadings = {
      English: [
        "Introduction & Context", "Key Concepts", "Deep Dive", "Core Analysis", 
        "Historical Perspective", "Practical Application", "Author's Vision", "Final Reflections"
      ],
      Gujarati: [
        "પ્રસ્તાવના અને સંદર્ભ", "મુખ્ય ખ્યાલો", "ઊંડાણપૂર્વક અભ્યાસ", "મૂળભૂત વિશ્લેષણ", 
        "ઐતિહાસિક દ્રષ્ટિકોણ", "વ્યવહારુ ઉપયોગ", "લેખકનો દ્રષ્ટિકોણ", "અંતિમ વિચારો"
      ],
      Hindi: [
        "परिचय और संदर्भ", "मुख्य अवधारणाएं", "गहरा अध्ययन", "मूल विश्लेषण", 
        "ऐतिहासिक परिप्रेक्ष्य", "व्यावहारिक उपयोग", "लेखक का दृष्टिकोण", "अंतिम विचार"
      ],
      Marathi: [
        "परिचय आणि संदर्भ", "मुख्य संकल्पना", "सखोल अभ्यास", "मूळ विश्लेषण", 
        "ऐतिहासिक दृष्टिकोन", "व्यावहारिक उपयोजन", "लेखकाचा दृष्टिकोन", "अंतिम विचार"
      ]
    };

    let p1, p2;

    if (language === 'English') {
      const type = (cat.includes('psychology') || cat.includes('self')) ? 'psychology' : 
                   (cat.includes('fiction') || cat.includes('fantasy')) ? 'fiction' : 'general';
      [p1, p2] = buildParagraphs(engSentences[type]);
    } else if (language === 'Gujarati') {
      const type = (cat.includes('psychology') || cat.includes('self')) ? 'psychology' : 
                   (cat.includes('fiction') || cat.includes('fantasy')) ? 'fiction' : 'general';
      [p1, p2] = buildParagraphs(gujSentences[type]);
    } else if (language === 'Hindi') {
      [p1, p2] = buildParagraphs(hinSentences);
    } else if (language === 'Marathi') {
      [p1, p2] = buildParagraphs(marSentences);
    } else {
       // Fallback for other languages to just return static english strings mapped for now (since user focused strictly on English/Gujarati)
       // Maintaining legacy mapping here to prevent breaking other UI translations
       p1 = `Translations for lengthy body text are currently focused on Gujarati and English. ${desc}`;
       p2 = `More detailed text generation is in progress for other languages. Please select English or Gujarati for the full native text generation experience.`;
    }

    const activeHeadings = sectionHeadings[language] || sectionHeadings['English'];
    const hIdx1 = getRand(activeHeadings.length, 9);
    let hIdx2 = getRand(activeHeadings.length, 10);
    if (hIdx1 === hIdx2) hIdx2 = (hIdx2 + 1) % activeHeadings.length;

    return {
      h1: activeHeadings[hIdx1],
      p1: p1,
      h2: activeHeadings[hIdx2],
      p2: p2
    };
  };

  const translations = {
    English: { ch: "Chapter", note: "Language Selected", title: "The Beginning" },
    Hindi: { ch: "अध्याय", note: "चयनित भाषा", title: "शुरुआत" },
    Gujarati: { ch: "પ્રકરણ", note: "પસંદ કરેલ ભાષા", title: "શરૂઆત" },
    Marathi: { ch: "अध्याय", note: "निवडलेली भाषा", title: "सुरुवात" },
    Tamil: { ch: "அத்தியாயம்", note: "தேர்ந்தெடுக்கப்பட்ட மொழி", title: "தொடக்கம்" },
    Spanish: { ch: "Capítulo", note: "Idioma Seleccionado", title: "El Comienzo" },
    French: { ch: "Chapitre", note: "Langue Sélectionnée", title: "Le Commencement" }
  };

  const currentContent = translations[language] || translations['English'];
  const structuredNarrative = book ? generateStructuredNarrative(currentPage) : {};

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <div className="container">
          <Link to="/books" className="back-link">← Back to Books</Link>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          <div className="detail-image-section">
            {book.image ? (
              <img 
                src={book.image.startsWith('http') ? book.image : `${API_BASE}/upload/${book.image}`} 
                alt={book.title} 
                className="detail-image" 
                onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${book._id || 'fallback'}/500/750`; }}
              />
            ) : (
              <div className="detail-placeholder" style={{ background: book.gradient }}>
                <span>{book.icon}</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <span className={`category-badge ${(book.category || 'general').toLowerCase()}`}>{book.category || 'General'}</span>
            <h1>{book.title}</h1>
            <p className="detail-author">by <strong>{book.author || 'Unknown Author'}</strong></p>

            <div className="detail-rating">
              <span className="stars">{renderStars(book.rating)}</span>
              <span className="rating-number">{book.rating || 0}</span>
              <span className="review-count">({book.reviews || 0} reviews)</span>
            </div>

            <p className="detail-price">₹{parseFloat(book.price || 0).toFixed(2)}</p>

            <div className="detail-description">
              <h3>About this book</h3>
              <p>{book.description || 'No description available for this book.'}</p>
              <p>This is a premium addition to our collection, carefully curated for our readers. Enjoy a seamless reading experience with Book Bazaar.</p>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{book.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Pages</span>
                <span className="meta-value">{totalPages}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Language</span>
                <span className="meta-value">English</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Publisher</span>
                <span className="meta-value">Book Bazaar Press</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn-primary detail-cart-btn" onClick={() => {
                if (!user) {
                  alert("Please login or register to read this book online.");
                  navigate('/login');
                  return;
                }
                setShowReader(true);
              }}>
                📖 Read Online
              </button>
              <button className="btn-secondary" onClick={() => onAddToCart(book)}>
                🛒 Add to Cart
              </button>
              {toggleWishlist && (
                <button 
                  className={`btn-secondary wishlist-action-btn ${isWishlisted ? 'active' : ''}`} 
                  onClick={() => toggleWishlist(book)}
                  style={{ 
                    padding: '10px 15px', 
                    borderRadius: 'var(--radius-md)', 
                    background: isWishlisted ? '#fee2e2' : 'var(--bg-secondary)',
                    color: isWishlisted ? '#dc2626' : 'var(--text-primary)',
                    border: `1px solid ${isWishlisted ? '#fca5a5' : 'var(--border-color)'}`
                  }}
                >
                  {isWishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
                </button>
              )}
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-section">
            <h2>You May Also Like</h2>
            <div className="related-grid">
              {relatedBooks.map(rb => (
                <Link to={`/book/${rb._id || rb.id}`} className="related-card" key={rb._id || rb.id}>
                  <div className="related-image">
                    {rb.image ? (
                      <img 
                        src={rb.image.startsWith('http') ? rb.image : `${API_BASE}/upload/${rb.image}`} 
                        alt={rb.title} 
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${rb._id || 'fallback'}/500/750`; }}
                      />
                    ) : (
                      <div className="related-placeholder" style={{ background: rb.gradient }}>{rb.icon}</div>
                    )}
                  </div>
                  <h4>{rb.title}</h4>
                  <p>₹{parseFloat(rb.price || 0).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReader && (
        <div className="reader-modal-overlay" onClick={() => setShowReader(false)}>
          <div className="reader-modal-content" onClick={(e) => e.stopPropagation()}>
             <div className="reader-header">
               <h2>{book.title}</h2>
               <div className="reader-controls">
                 <select value={language} onChange={(e) => { setLanguage(e.target.value); setCurrentPage(1); }} className="language-select">
                   <option value="English">English</option>
                   <option value="Hindi">Hindi (हिंदी)</option>
                   <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                   <option value="Marathi">Marathi (मराठी)</option>
                   <option value="Tamil">Tamil (தமிழ்)</option>
                   <option value="Spanish">Spanish (Español)</option>
                   <option value="French">French (Français)</option>
                 </select>
                 <button className="close-reader-btn" onClick={() => setShowReader(false)}>✕</button>
               </div>
             </div>
             <div className="reader-body">
               <div className="reader-page">
                 <h3>{currentContent.ch} {Math.ceil(currentPage / 15)}: {currentContent.title}</h3>
                 
                 <h4 className="reader-heading">{structuredNarrative.h1}</h4>
                 <p className="reader-paragraph">
                   {structuredNarrative.p1}
                 </p>
                 
                 <h4 className="reader-heading">{structuredNarrative.h2}</h4>
                 <p className="reader-paragraph">
                   {structuredNarrative.p2}
                 </p>
                 
                 <p className="reader-note">
                    <strong>{currentContent.note}: {language}</strong>
                 </p>
               </div>
               
               <div className="reader-pagination" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
                  <button 
                    className="btn-secondary" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    ← Previous Page
                  </button>
                  <span style={{fontWeight: '600', color: 'var(--text-primary)'}}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    className="btn-secondary" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next Page →
                  </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetailPage;
