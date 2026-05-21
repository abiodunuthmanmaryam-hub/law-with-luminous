const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'));

const ARTICLES = [
  {
    category: 'Constitutional Law',
    slug: 'know-your-constitutional-rights',
    translations: {
      en: {
        title: 'Know Your Constitutional Rights',
        what_is_this: 'The Nigerian Constitution guarantees every citizen fundamental rights that no government or individual can legally take away.',
        why_you_need_to_know: 'Without knowing these rights, you may allow others to violate them without realizing it.',
        simple_version: 'You have rights by law. Nobody — not even the police — can take them away without going to court.',
        formal_explanation: 'Chapter IV of the 1999 Constitution (as amended) enshrines Fundamental Rights including the right to life, dignity, fair hearing, privacy, and freedom of expression.',
        common_scenarios: 'Police detaining you beyond 24 hours without charge|Government demolishing your house without compensation|Being fired for belonging to a union',
        your_rights: 'Right to life|Right to dignity|Right to fair hearing|Right to personal liberty|Freedom of expression|Freedom of movement',
        your_responsibilities: 'Exercise rights without infringing on others|Follow lawful court orders',
        what_to_do: '1. Document every violation with photos/videos|2. Write a petition to the nearest police station|3. Contact a human rights lawyer or the NBA|4. File a Fundamental Rights Enforcement case in Federal High Court',
        where_to_get_help: 'Civil Liberties Organisation (CLO), Legal Aid Council, Nigerian Bar Association (NBA), SERAP',
        faq: 'Can my rights be suspended? Only during a declared state of emergency, and even then, some rights cannot be suspended.'
      },
      pcm: {
        title: 'Wetin Be Your Constitutional Rights',
        what_is_this: 'The Nigerian Constitution don give every person fundamental rights wey nobody fit take from you by force.',
        why_you_need_to_know: 'If you no sabi your rights, people go dey trample on them and you no go even know.',
        simple_version: 'You get rights by law. Even oga police no fit just do you anyhow without court order.',
        formal_explanation: 'Chapter IV of the 1999 Constitution talk about Fundamental Rights — right to life, dignity, freedom, and many more.',
        common_scenarios: 'Police lock you up pass 24 hours without charge|Government demolish your house without paying you|Dem sack you because you join union',
        your_rights: 'Right to live|Right to dignity|Right to fair hearing|Right to freedom|Right to talk your mind|Right to move around',
        your_responsibilities: 'Use your rights well, no oppress others|Follow court orders wey dey valid',
        what_to_do: '1. Snap photo or record video of the violation|2. Report to police station|3. Find human rights lawyer|4. Go court if dem no listen',
        where_to_get_help: 'Civil Liberties Organisation (CLO), Legal Aid Council, NBA',
        faq: 'Dem fit suspend my rights? Only if state of emergency don declare, and even den, some rights still stand.'
      },
      yo: {
        title: 'Mọ Ẹtọ Rẹ Labẹ Ofin Orile-Ede',
        what_is_this: 'Ofin Orile-ede Naijiria fun gbogbo eniyan ni ẹtọ ipilẹ ti ẹnikẹni ko le gba lọwọ wọn.',
        why_you_need_to_know: 'Bi o ko ba mọ ẹtọ rẹ, awọn miiran le fọ wọn laisi rẹ mimọ.',
        simple_version: 'O ni ẹtọ labẹ ofin. Ko si ẹnikẹni — pẹlu ọlọpa — ti o le gba wọn lọwọ rẹ laisi aṣẹ ile-ẹjọ.',
        formal_explanation: 'Ori-iwe IV ti Ofin Orile-ede 1999 pẹlu Ẹtọ Ipilẹ: ẹtọ si igbesi aye, ọlá, idajọ ododo, ati ominira.',
        common_scenarios: 'Ọlọpa ti ọ ninu tubu ju wakati 24 lọ|Ijọba fọ ile rẹ laisi ẹsan|A le ọ nipa ti ẹgbẹ iṣẹ',
        your_rights: 'Ẹtọ si igbesi aye|Ẹtọ si ọlá|Ẹtọ si idajọ ododo|Ẹtọ si ominira|Ominira ọrọ|Ominira gbigbe',
        your_responsibilities: 'Lo ẹtọ rẹ laisi ba ti awọn miiran jẹ|Tẹle aṣẹ ile-ẹjọ',
        what_to_do: '1. Gba aworan tabi fidio ẹri irufin naa|2. Kọ ẹbẹ si ibode ọlọpa|3. Kan si agbẹjọro ẹtọ eniyan|4. Lọ si ile-ẹjọ giga Apapo',
        where_to_get_help: 'Civil Liberties Organisation (CLO), Legal Aid Council, NBA',
        faq: 'Nje wọn le daduro ẹtọ mi? Nikan ni igba ti ijọba kede ipo pajawiri.'
      },
      ig: {
        title: 'Mara Ikike Gị n\'Iwu Obodo',
        what_is_this: 'Iwu Obodo Nigeria nyere onye ọbụla ikike ndụ ndị na-enweghị onye nwere ike iwepụ na aka ha n\'iwu.',
        why_you_need_to_know: 'Ọ bụrụ na ịmara ikike gị, ọ ga-adị ngwa ngwa maka ndị ọzọ ịpọgide ha.',
        simple_version: 'Ị nwere ikike n\'iwu. Ọ bụ onye ọbụla, ọbụghị ndị uwe ojii, nwere ike iwepụ ha na-enweghị iwu ụlọ ikpe.',
        formal_explanation: 'Isi-oche IV nke Iwu Obodo 1999 dere Ikike Ndụ Ndị bụ: ikike ndụ, nsọpụrụ, ikpe ezi uche, na nnwere onwe.',
        common_scenarios: 'Ndị uwe ojii mechie gị n\'ụlọ mkpọrọ karịa awa 24|Gọọmentị tụchaa ụlọ gị na-akwụghị gị ụgwọ|E kewapụrụ gị ọrụ n\'ihi ịbanye n\'otu ọrụ',
        your_rights: 'Ikike ndụ|Ikike nsọpụrụ|Ikike ikpe ezi uche|Ikike nnwere onwe|Nnwere onwe okwu|Nnwere onwe njem',
        your_responsibilities: 'Jiri ikike gị n\'ụzọ ọma, ghara ịtambanye nke ndị ọzọ|Soro iwu ụlọ ikpe kwesịrị',
        what_to_do: '1. Foto ma ọ bụ vidiyo ihe omume njọ ahụ|2. Dekwaa petishọn n\'ụlọ ndị uwe ojii|3. Kpọọ ụkọchukwu ikike mmadụ|4. Gaa ụlọ ikpe elu mba',
        where_to_get_help: 'Civil Liberties Organisation (CLO), Legal Aid Council, NBA',
        faq: 'Enwere ike ikwọ ikike m? Naanị mgbe gọọmentị kwọpụtara ọnọdụ ihe ize ndụ.'
      },
      ha: {
        title: 'Sanin Haƙƙoƙin Ka na Tsarin Mulki',
        what_is_this: 'Kundin Tsarin Mulkin Najeriya ya ba kowace ɗan ƙasa haƙƙoƙi na asali wanda babu wanda zai iya kwace su.',
        why_you_need_to_know: 'Idan ba ka san haƙƙoƙin ka ba, wasu zasu iya keta su ba tare da ka sani ba.',
        simple_version: 'Kana da haƙƙoƙi ta hanyar doka. Har ma \'yan sanda ba za su iya yi maka wani abu ba sai da umurnin kotu.',
        formal_explanation: 'Babi na IV na Kundin Tsarin Mulki na 1999 ya ƙunshi Haƙƙoƙin Asali: haƙƙin rayuwa, mutunci, shari\'a mai adalci, da \'yanci.',
        common_scenarios: 'Yandanda sun tsare ka fiye da awanni 24|Gwamnati ta rushe gidanka ba tare da diyya ba|An kore ka saboda shiga ƙungiyar ma\'aikata',
        your_rights: 'Haƙƙin rayuwa|Haƙƙin mutunci|Haƙƙin shari\'a mai adalci|Haƙƙin \'yanci|\'Yancin faɗa ra\'ayi|\'Yancin zirga-zirga',
        your_responsibilities: 'Yi amfani da haƙƙoƙin ka ba tare da take na wasu ba|Bi umurnin kotu na gaskiya',
        what_to_do: '1. Ɗauki hoto ko bidiyo na take haƙƙi|2. Rubuta koke zuwa ofishin \'yan sanda|3. Tuntuɓi lauya mai kare haƙƙin ɗan adam|4. Kai ƙara a Kotun Tarayya',
        where_to_get_help: 'Civil Liberties Organisation (CLO), Legal Aid Council, NBA',
        faq: 'Za a iya dakatar da haƙƙoƙin na? Kawai a lokacin da aka ayyana dokar ta baci.'
      }
    }
  },
  {
    category: 'Criminal Law',
    slug: 'what-happens-when-police-arrest-you',
    translations: {
      en: {
        title: 'What Happens When Police Arrest You',
        what_is_this: 'Being arrested does not mean you are guilty. The law gives you specific rights the moment police detain you.',
        why_you_need_to_know: 'Many Nigerians are held illegally because they do not know they can demand their rights.',
        simple_version: 'Police cannot just lock you up and forget you. The law says: charge you or release you within 24-48 hours.',
        formal_explanation: 'Section 35 of the 1999 Constitution provides that any arrested person must be informed of the reason, brought before a court within 24 hours (ordinary offence) or 48 hours (serious offence), or released on bail.',
        common_scenarios: 'Police arrest you without showing a warrant|Police demand money to release you|Police hold you more than 48 hours without charge',
        your_rights: 'Right to know why you are arrested|Right to remain silent|Right to a lawyer immediately|Right to be charged or released within 24-48 hours|Right to bail (for bailable offences)|Right to contact your family',
        your_responsibilities: 'Do not resist arrest physically even if unlawful|Do not sign any document without a lawyer present',
        what_to_do: '1. Stay calm — do not fight the police|2. Ask: "What am I being arrested for?"|3. Say: "I want to speak to a lawyer"|4. Do not answer questions without a lawyer|5. Memorize badge numbers|6. Call family when allowed|7. After release, report to NBA or human rights group',
        where_to_get_help: 'Legal Aid Council (free lawyers), NHRC, NBA, SERAP Hotline',
        faq: 'Can police arrest me without a warrant? Yes, if they witness you committing a crime. Otherwise, they need a warrant.'
      },
      pcm: {
        title: 'Wetin Go Happen When Police Carry You',
        what_is_this: 'If police carry you, e no mean say you do crime. Law give you rights from that very moment.',
        why_you_need_to_know: 'Many Nigerians dey suffer inside cell because dem no know dem rights.',
        simple_version: 'Police no fit lock you up forget you. Law say: charge you or release you within 24-48 hours.',
        formal_explanation: 'Section 35 of the 1999 Constitution say any person wey dem arrest must know why, and dem must charge am for court within 24 hours (small offence) or 48 hours (serious offence).',
        common_scenarios: 'Police arrest you without showing warrant|Police dey ask money before dem free you|Police keep you pass 48 hours without charge',
        your_rights: 'Right to know why dem carry you|Right to keep quiet|Right to lawyer immediately|Right to dey charged or released within 24-48 hours|Right to bail|Right to call your family',
        your_responsibilities: 'No fight police even if dem do you wrong|No sign any paper without lawyer',
        what_to_do: '1. Calm down, no fight|2. Ask: "Why una carry me?"|3. Say: "I want lawyer"|4. No answer questions without lawyer|5. Remember badge number|6. Call family when dem allow|7. After you comot, report to NBA',
        where_to_get_help: 'Legal Aid Council, NHRC, NBA, SERAP',
        faq: 'Police fit carry me without warrant? Yes, if dem see you do crime. Otherwise dem need warrant.'
      },
      yo: {
        title: 'Kini Yoo Ṣẹlẹ Ti Ọlọpa Ba Mu Ọ',
        what_is_this: 'Ti ọlọpa ba mu ọ, ko tumọ si pe o jẹbi. Ofin fun ọ ni ẹtọ lati ìgbà yẹn.',
        why_you_need_to_know: 'Ọpọlọpọ Naijirians ni a tọ ni aifẹ nitori wọn ko mọ ẹtọ wọn.',
        simple_version: 'Ọlọpa ko le tọ ọ mọ wọn gbẹ́yà. Ofin sọ pe: fi ẹsun kan ọ tabi tu ọ silẹ laarin awọn wakati 24-48.',
        formal_explanation: 'Abala 35 ti Ofin Orile-ede 1999 sọ pe ẹnikẹni ti a mu gbọdọ mọ idi, a si gbọdọ mu wọn wa siwaju ile-ẹjọ laarin wakati 24 tabi 48.',
        common_scenarios: 'Ọlọpa mu ọ laisi ṣafihan iwe aṣẹ|Ọlọpa fẹ owo lati tu ọ silẹ|Ọlọpa tọ ọ ju wakati 48 lọ laisi ẹsun',
        your_rights: 'Ẹtọ lati mọ idi imuni|Ẹtọ lati dakẹ|Ẹtọ si agbẹjọro lẹsẹkẹsẹ|Ẹtọ lati fi ẹsun kan ọ tabi tu ọ silẹ laarin 24-48 wakati|Ẹtọ si ìdáǹdè|Ẹtọ lati pe ẹbí',
        your_responsibilities: 'Maṣe ja ọlọpa paapaa ti wọn ba ṣe aṣiṣe|Maṣe fọwọsi iwe kankan laisi agbẹjọro',
        what_to_do: '1. Jẹ alaafia — maṣe ja ọlọpa|2. Beere: "Kini idi imuni mi?"|3. Sọ: "Mo fẹ ba agbẹjọro sọrọ"|4. Maṣe dahun ibeere laisi agbẹjọro|5. Ranti nọmba àmi ọlọpa|6. Pe ẹbí nigbati a ba gba ọ laaye|7. Lẹhin itusilẹ, ṣaroye si NBA',
        where_to_get_help: 'Legal Aid Council, NHRC, NBA, SERAP',
        faq: 'Nje ọlọpa le mu mi laisi iwe aṣẹ? Bẹẹni, ti wọn ba ri ọ ti o n ṣe ẹṣẹ. Bibẹkọ, wọn nilo iwe aṣẹ.'
      },
      ig: {
        title: 'Ihe Na-eme Mgbe Ndị Uwe Ojii Jide Gị',
        what_is_this: 'Ọ bụrụ na ndị uwe ojii jide gị, ọ pụtaghị na ị mere ihe njọ. Iwu nyere gị ikike site n\'oge ahụ.',
        why_you_need_to_know: 'Ọtụtụ ndị Naijirịa na-anọ n\'ụlọ mkpọrọ n\'ụzọ iwu na-akwadoghị n\'ihi na ha amaghị ikike ha.',
        simple_version: 'Ndị uwe ojii enweghị ike izoro gị n\'ụlọ mkpọrọ wee wechefuo gị. Iwu sị: bia n\'ụlọ ikpe ma ọ bụ hapụ gị n\'etiti awa 24-48.',
        formal_explanation: 'Ngalaba 35 nke Iwu Obodo 1999 sị na onye ọbụla a jidere ga-anọ n\'ụlọ ikpe n\'etiti awa 24 (mpụ dị mfe) ma ọ bụ 48 (mpụ dị ukwuu).',
        common_scenarios: 'Ndị uwe ojii jide gị na-egosighị ikike iwu|Ndị uwe ojii chọrọ ego tupu ha hapu gị|Ha nọchiri gị n\'ụlọ mkpọrọ karịa awa 48 na-anara gị ikpe',
        your_rights: 'Ikike ịmara ihe mere ji jide gị|Ikike ịcichee ọnụ|Ikike ụkọchukwu ozugbo|Ikike ịbụrụ n\'ụlọ ikpe ma ọ bụ hapu n\'etiti awa 24-48|Ikike bail|Ikike ịkpọọ ezinụlọ gị',
        your_responsibilities: 'Emela ọgụ na ndị uwe ojii ọbụghị n\'ihi na ha mere ihe njọ|Edenyelaghị akwụkwọ ọbụla na-enweghị ụkọchukwu',
        what_to_do: '1. Dị ndụ ọcha — emela ọgụ|2. Jụọ: "Gịnị mere ji jide m?"|3. Kwuo: "Achọrọ m ụkọchukwu"|4. Azaghị ajụjụ ọbụla na-enweghị ụkọchukwu|5. Cheta nọmba ihe nchọ|6. Kpọọ ezinụlọ mgbe ha kwere|7. Mgbe emechara, kpọọ NBA',
        where_to_get_help: 'Legal Aid Council, NHRC, NBA, SERAP',
        faq: 'Ndị uwe ojii nwere ike ijide m na-enweghị ikike iwu? Ee, ọ bụrụ ha hụrụ gị na-eme mpụ. Ma ọ dịghị otú ahụ, ha chọrọ ikike iwu.'
      },
      ha: {
        title: 'Abin Da Zai Faru Idan \'Yan Sanda Sun Kama Ka',
        what_is_this: 'Kama ba ya nufin laifi. Doka ta ba ka haƙƙoƙi tun daga lokacin da aka kama ka.',
        why_you_need_to_know: 'Yawancin \'yan Najeriya suna zaune a tsare ba bisa ka\'ida ba don ba su san haƙƙoƙin su ba.',
        simple_version: 'Yan sanda ba za su iya kulle ka su manta da kai ba. Doka ta ce: kai ƙara a kotu ko sake ka cikin awanni 24-48.',
        formal_explanation: 'Sashe na 35 na Kundin Tsarin Mulki 1999 ya ce duk wanda aka kama dole a sanar da shi dalilin, a kai shi kotu cikin awanni 24 (laifin yau da kullum) ko 48 (laifi mai tsanani).',
        common_scenarios: '\'Yan sanda sun kama ka ba tare da nuna takardar sammaci ba|\'Yan sanda suna neman kudi kafin su sake ka|\'Yan sanda sun tsare ka fiye da awanni 48 ba tare da tuhumar ka ba',
        your_rights: 'Haƙƙin sanin dalilin kamawa|Haƙƙin yin shiru|Haƙƙin lauya nan da nan|Haƙƙin kai ƙara a kotu ko sake ka cikin awanni 24-48|Haƙƙin beli|Haƙƙin tuntuɓar iyali',
        your_responsibilities: 'Kada ka tsauta wa \'yan sanda ko da suna yi maka laifi|Kada ka sanya hannu a duk wata takarda ba tare da lauya ba',
        what_to_do: '1. Kasance mai kwanciyar hankali — kada ka yi faɗa|2. Tambayi: "Me ya sa aka kama ni?"|3. Ce: "Ina so in yi magana da lauya"|4. Kada ka amsa tambayoyi ba tare da lauya ba|5. Tuna lambar alama|6. Kira iyali idan an baka izini|7. Bayan an sake ka, ba da rahoto ga NBA',
        where_to_get_help: 'Legal Aid Council, NHRC, NBA, SERAP',
        faq: 'Shin \'yan sanda za su iya kama ni ba tare da sammaci ba? Ee, idan sun gan ka kana aikata laifi. In ba haka ba, suna bukatar sammaci.'
      }
    }
  },
  {
    category: 'Property Law',
    slug: 'landlord-tenant-rights',
    translations: {
      en: {
        title: 'Landlord & Tenant Rights',
        what_is_this: 'The laws governing the relationship between a property owner and a renter.',
        why_you_need_to_know: 'In Nigeria, many landlords try to throw tenants out without notice. Knowing the law protects your home.',
        simple_version: 'Your landlord cannot just throw your things out. They must follow the court process and give you proper notice (usually 6 months for yearly tenants).',
        formal_explanation: 'Governed by the Tenancy Law, it stipulates legal procedures for recovery of possession. A landlord cannot resort to "self-help" like removing the roof or cutting off electricity.',
        common_scenarios: 'Landlord refuses to return your caution fee when you move out|Landlord increases rent drastically without proper notice|Landlord brings "area boys" to threaten you to pack out',
        your_rights: 'Right to peaceful enjoyment of the property|Right to a valid "Quit Notice" (6 months for yearly tenants)|Right to a "7 Days Notice of Owner\'s Intention to Recover"',
        your_responsibilities: 'Pay your rent on time|Keep the property in good condition|Follow the rules in your tenancy agreement',
        what_to_do: '1. Stay calm — do not fight|2. Take videos if they destroy property|3. Report to Police Station for "Conduct Likely to Cause Breach of Peace"|4. Contact Citizens Mediation Centre',
        where_to_get_help: 'Office of the Public Defender (OPD), Citizens Mediation Centre, or NBA',
        faq: 'Can my landlord remove my door? No! That is a criminal offense.'
      },
      pcm: {
        title: 'Landlord and Tenant Rights',
        what_is_this: 'Na the law wey cover house owner and person wey rent house.',
        why_you_need_to_know: 'Many landlords for Nigeria like to pursue people anyhow. If you sabi law, your eye go open.',
        simple_version: 'Landlord no fit just throw your load for outside. Dem must follow court and give you proper notice.',
        formal_explanation: 'Tenancy Law say landlord no fit use force or "self-help" pursue you.',
        common_scenarios: 'Landlord no wan gree give you caution fee back|Landlord increase rent high anyhow without talk|Landlord bring area boys come threaten you',
        your_rights: 'Right to stay for house without wahala|Right to get Quit Notice (6 months if you dey pay yearly)|Right to get 7 days notice after Quit Notice finish',
        your_responsibilities: 'Pay your rent when e reach|No spoil house|Follow the rules wey una sign',
        what_to_do: '1. Maintain your level, no fight|2. Record video if dem dey spoil things|3. Report to police|4. Find lawyer or go Citizens Mediation Centre',
        where_to_get_help: 'Office of the Public Defender (OPD), Citizens Mediation Centre',
        faq: 'Landlord fit remove my door? Lie lie! Na crime be that.'
      },
      yo: {
        title: 'Ẹtọ Onile ati Agbatọju',
        what_is_this: 'Ofin ti o n ṣakoso ajọṣepọ laarin onile ati ẹni ti o ya ile.',
        why_you_need_to_know: 'Ni Naijiria, ọpọlọpọ onile fẹ lati le agbatọju jade laisi akiyesi.',
        simple_version: 'Onile rẹ ko le sọ ẹrù rẹ jade bẹbẹ. Wọn gbọdọ tẹle ilana ile-ẹjọ.',
        formal_explanation: 'Ofin Agbatọju sọ pe onile ko le lo agbara lati gba ile rẹ pada.',
        common_scenarios: 'Onile kọ lati san owo caution rẹ pada|Onile gbe owo ile soke laisi akiyesi|Onile mu awọn ọmọ ita wa lati dẹruba ọ',
        your_rights: 'Ẹtọ si alaafia ninu ile|Ẹtọ si iwe akiyesi (Quit Notice)|Ẹtọ si akiyesi ọjọ meje',
        your_responsibilities: 'San owo ile rẹ ni akoko|Tọju ile naa daradara|Tẹle adehun ti o fọwọsi',
        what_to_do: '1. Jẹ alaafia|2. Gba fidio ẹri|3. Lọ si ibode ọlọpa|4. Kan si Citizens Mediation Centre',
        where_to_get_help: 'OPD, Citizens Mediation Centre, tabi NBA',
        faq: 'Ṣe onile le yọ ilẹkun mi? Rara! Ẹṣẹ ọdaràn ni iyẹn.'
      },
      ig: {
        title: 'Ikike Ononye na Onye Bi n\'Ulo',
        what_is_this: 'Iwu na-achịkwa njikọ dị n\'etiti onye nwe ụlọ na onye na-akwụ ụgwọ ụlọ.',
        why_you_need_to_know: 'N\'ala anyị, ọtụtụ ndị nwe ụlọ na-achụpụ ndị mmadụ n\'ụzọ na-adịghị mma.',
        simple_version: 'Onye nwe ụlọ enweghị ike ịtụpụ ihe gị n\'èzí. Ha ga-esoro iwu ụlọ ikpe.',
        formal_explanation: 'Iwu Tenancy sị na onye nwe ụlọ agaghị eji ike weghara ụlọ ya n\'aka onye bi n\'ime ya.',
        common_scenarios: 'Onye nwe ụlọ ajụ ịkwụghachi gị ego caution gị|Onye nwe ụlọ agbagote ego ụlọ na-agwaghị gị|Onye nwe ụlọ akpọta area boys ka ha dẹnye gị egwu',
        your_rights: 'Ikike ibi n\'ụlọ n\'udo|Ikike Quit Notice (ọnwa isii maka ndị na-akwụ kwa afọ)|Ikike 7 days notice',
        your_responsibilities: 'Kwụọ ụgwọ ụlọ gị n\'oge|Lekọta ụlọ ahụ anya|Soro iwu ị bịanyere aka na ya',
        what_to_do: '1. Jụụ nụ nchụ — emela ọgụ|2. Were vidiyo ma ọ bụrụ na ha na-emebi ihe|3. Gaa n\'ụlọ ndị uwe ojii|4. Kpọọ Citizens Mediation Centre',
        where_to_get_help: 'OPD, Citizens Mediation Centre, NBA',
        faq: 'Onye nwe ụlọ nwere ike iwepụ ibo ụzọ m? Mba! Ọ bụ mpụ.',
      },
      ha: {
        title: 'Haƙƙoƙin Mai Gida da Mai Haya',
        what_is_this: 'Dokokin da ke tsara alaƙa tsakanin mai gida da mai haya.',
        why_you_need_to_know: 'A Najeriya, masu gida da yawa suna ƙoƙarin korar masu haya ba tare da sanarwa ba.',
        simple_version: 'Mai gidan ka ba zai iya fitar da kayan ka waje kawai ba. Dole ne su bi tsarin kotu.',
        formal_explanation: 'Dokar hayar gida ta bayyana cewa mai gida ba zai iya amfani da ƙarfin kansa wajen karɓar gida ba.',
        common_scenarios: 'Mai gida ya ƙi mayar da kuɗin "caution"|Mai gida ya ƙara kuɗin haya ba tare da sanarwa ba|Mai gida ya kawo \'yan iska don tsoratar da kai',
        your_rights: 'Haƙƙin zama a gida cikin kwanciyar hankali|Haƙƙin samun sanarwar tashi (wata 6 ga masu haya na shekara)|Haƙƙin sanarwar kwanaki 7',
        your_responsibilities: 'Biya haya akan lokaci|Kula da gidan da kyau|Bi ƙa\'idojin yarjejeniyar da kuka yi',
        what_to_do: '1. Kasance cikin kwanciyar hankali|2. Ɗauki bidiyo idan suna lalata kaya|3. Kai ƙara ofishin \'yan sanda|4. Tuntuɓi Citizens Mediation Centre',
        where_to_get_help: 'OPD, Citizens Mediation Centre, ko NBA',
        faq: 'Shin mai gida zai iya cire ƙofata? A\'a! Wannan laifi ne.',
      }
    }
  },
  {
    category: 'Employment Law',
    slug: 'employment-rights',
    translations: {
      en: {
        title: 'Employment Rights & Wrongful Dismissal',
        what_is_this: 'The laws that protect workers in Nigeria from unfair treatment by bosses.',
        why_you_need_to_know: 'Many companies fire staff without paying them or following the contract. You are protected by the Labor Act.',
        simple_version: 'Your boss cannot just sack you without following your contract. They must pay you for the work you have done.',
        formal_explanation: 'Governed by the Labor Act and the National Industrial Court. It covers contracts, wages, leave, and termination procedures.',
        common_scenarios: 'Boss sacks you because you are pregnant|Boss refuses to pay your last month salary|Boss fires you without giving the required notice period',
        your_rights: 'Right to a written contract within 3 months|Right to paid leave|Right to minimum wage|Right to notice before termination',
        your_responsibilities: 'Do your work honestly|Follow company policies|Protect company property',
        what_to_do: '1. Check your employment contract|2. Keep all emails and salary slips|3. Write a formal letter of complaint to HR|4. Contact the Ministry of Labor or a lawyer',
        where_to_get_help: 'Ministry of Labor, National Industrial Court, or a Lawyer',
        faq: 'Can my boss fire me via WhatsApp? It depends on your contract, but usually, a formal letter is required.'
      },
      pcm: {
        title: 'Work Rights and How Dem Take Sack Person',
        what_is_this: 'Na the law wey cover workers for Nigeria so that oga no go use dem do yeye.',
        why_you_need_to_know: 'Many companies dey sack people anyhow without pay. Labor Act dey cover you.',
        simple_version: 'Your oga no fit just sack you anyhow. Dem must follow wetin una sign for contract and pay you your money.',
        formal_explanation: 'Labor Act and National Industrial Court na dem dey handle worker wahala.',
        common_scenarios: 'Oga sack you because you carry belle|Oga no wan pay you your last salary|Oga sack you today today without notice',
        your_rights: 'Right to get paper wey show una work agreement|Right to go leave wey dem pay for|Right to get at least minimum wage|Right to get notice before dem sack you',
        your_responsibilities: 'Do your work well|Follow company rules|No spoil company things',
        what_to_do: '1. Look wetin una sign for contract|2. Keep all your salary papers and emails|3. Write letter to HR|4. Go Ministry of Labor or find lawyer',
        where_to_get_help: 'Ministry of Labor, National Industrial Court',
        faq: 'Oga fit sack me for WhatsApp? E depend on your contract, but dem usually need to give you proper letter.'
      },
      yo: {
        title: 'Ẹtọ lẹnu Iṣẹ ati Itusilẹ Alaiṣootọ',
        what_is_this: 'Awọn ofin ti o n daabobo awọn oṣiṣẹ ni Naijiria lọwọ iwa aiṣootọ oníṣẹ́.',
        why_you_need_to_know: 'Ọpọlọpọ ile-iṣẹ n le oṣiṣẹ jade laisi sisanwo tabi tẹle adehun.',
        simple_version: 'Ọga rẹ ko le le ọ jade laisi tẹle adehun rẹ. Wọn gbọdọ sanwo fun iṣẹ ti o ti ṣe.',
        formal_explanation: 'Ofin Iṣẹ (Labor Act) ati Ile-ẹjọ Ile-iṣẹ ti Orilẹ-ede lo n ṣakoso eyi.',
        common_scenarios: 'Ọga le ọ jade nitori o loyun|Ọga kọ lati san owo oṣu rẹ to kẹhin|Ọga le ọ jade lojiji laisi akiyesi',
        your_rights: 'Ẹtọ si adehun kikọ|Ẹtọ si isinmi ti a sanwo fun|Ẹtọ si owo oṣu ti o kere julọ|Ẹtọ si akiyesi ṣaaju itusilẹ',
        your_responsibilities: 'Ṣe iṣẹ rẹ pẹlu otitọ|Tẹle awọn ilana ile-iṣẹ|Dabobo ohun-ini ile-iṣẹ',
        what_to_do: '1. Wo adehun iṣẹ rẹ|2. Tọju gbogbo awọn iwe owo oṣu rẹ|3. Kọ lẹta si HR|4. Kan si Ile-iṣẹ ti Iṣẹ tabi agbẹjọro',
        where_to_get_help: 'Ministry of Labor, National Industrial Court',
        faq: 'Ṣe ọga le le mi lori WhatsApp? O da lori adehun rẹ, ṣugbọn lẹta ti o tọ ni a maa n lo.'
      },
      ig: {
        title: 'Ikike Ndị Ọrụ na Nchụpụ n\'Ụzọ na-adịghị mma',
        what_is_this: 'Iwu na-echebe ndị ọrụ nọ na Nigeria ka ndị nwe ọrụ ghara imegbu ha.',
        why_you_need_to_know: 'Ọtụtụ ụlọ ọrụ na-achụpụ ndị ọrụ na-akwụghị ha ụgwọ. Iwu Labour Act chebere gị.',
        simple_version: 'Oga gị enweghị ike ịchụpụ gị na-esoghị iwu ị bịanyere aka na ya. Ha ga-akwụ gị ụgwọ ọrụ gị.',
        formal_explanation: 'Ọ bụ Labour Act na National Industrial Court na-achịkwa ihe ndị a.',
        common_scenarios: 'Oga chụpụrụ gị n\'ihi na ị dị ime|Oga ajụ ịkwụ gị ụgwọ ọnwa ikpeazụ gị|Oga chụpụrụ gị ozugbo na-enyeghị gị Quit Notice',
        your_rights: 'Ikike inweta akwụkwọ nkwekọrịta ọrụ|Ikike ezumike a na-akwụ ụgwọ ya|Ikike inweta minimum wage|Ikike inweta notice tupu a chụpụ gị',
        your_responsibilities: 'Jiri obi gị niile rụọ ọrụ|Soro iwu ụlọ ọrụ|Lekọta ihe ụlọ ọrụ anya',
        what_to_do: '1. Lee akwụkwọ nkwekọrịta ọrụ gị|2. Debe akwụkwọ ụgwọ ọnwa gị niile|3. Dekwara ndị HR akwụkwọ|4. Gaa na Ministry of Labour ma ọ bụ kpọọ ụkọchukwu',
        where_to_get_help: 'Ministry of Labour, National Industrial Court',
        faq: 'Oga m nwere ike ịchụpụ m na WhatsApp? Ọ dabere na nkwekọrịta gị, mana ha kwesịrị ide akwụkwọ edere ede.'
      },
      ha: {
        title: 'Haƙƙoƙin Ma\'aikata da Korar da ba ta dace ba',
        what_is_this: 'Dokokin da ke kare ma\'aikata a Najeriya daga zalunci daga shugabannin su.',
        why_you_need_to_know: 'Kamfanoni da yawa suna korar ma\'aikata ba tare da biyansu ba. Dokar Labor Act tana kare ka.',
        simple_version: 'Shugabanka ba zai iya korarka kawai ba tare da bin yarjejeniyar ku ba. Dole ne su biya ka aikin da ka yi.',
        formal_explanation: 'Dokar Kwadago (Labor Act) da Kotun Masana\'antu ta Kasa ne ke kula da wannan.',
        common_scenarios: 'Shugaba ya kore ka don kana da juna biyu|Shugaba ya ƙi biyan ka albashin ka na ƙarshe|Shugaba ya kore ka nan da nan ba tare da sanarwa ba',
        your_rights: 'Haƙƙin samun yarjejeniyar aiki a rubuce|Haƙƙin samun hutu mai biya|Haƙƙin samun mafi ƙarancin albashi|Haƙƙin samun sanarwa kafin korarka',
        your_responsibilities: 'Gudanar da aikin ka cikin gaskiya|Bin ƙa\'idojin kamfani|Kare kayan kamfani',
        what_to_do: '1. Duba yarjejeniyar aikin ka|2. Adana dukkan takardun albashi da imel|3. Rubuta wasiƙar ƙara zuwa HR|4. Tuntuɓi Ma\'aikatar Kwadago ko lauya',
        where_to_get_help: 'Ministry of Labor, National Industrial Court',
        faq: 'Shin shugabana zai iya kore ni ta WhatsApp? Ya danganta da yarjejeniyar ku, amma yawanci wasiƙa ake buƙata.'
      }
    }
  }
];

db.serialize(() => {
  console.log('🌱 Seeding database...');

  // Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    slug TEXT UNIQUE,
    is_published INTEGER DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS article_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    language_code TEXT,
    title TEXT,
    what_is_this TEXT,
    why_you_need_to_know TEXT,
    simple_version TEXT,
    formal_explanation TEXT,
    common_scenarios TEXT,
    your_rights TEXT,
    your_responsibilities TEXT,
    what_to_do TEXT,
    where_to_get_help TEXT,
    faq TEXT,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
  )`);

  ARTICLES.forEach(article => {
    db.run(`INSERT OR IGNORE INTO articles (category, slug) VALUES (?, ?)`,
      [article.category, article.slug], function(err) {
        if (err) return console.error(`Error inserting article ${article.slug}:`, err);
        const articleId = this.lastID;
        
        if (!articleId) {
          db.get(`SELECT id FROM articles WHERE slug = ?`, [article.slug], (err, row) => {
            if (row) seedTranslations(row.id, article);
          });
        } else {
          seedTranslations(articleId, article);
        }
      }
    );
  });

  function seedTranslations(articleId, article) {
    const stmt = db.prepare(`INSERT OR IGNORE INTO article_translations
      (article_id, language_code, title, what_is_this, why_you_need_to_know, simple_version,
       formal_explanation, common_scenarios, your_rights, your_responsibilities, what_to_do,
       where_to_get_help, faq) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    
    Object.entries(article.translations).forEach(([lang, t]) => {
      stmt.run([articleId, lang, t.title, t.what_is_this, t.why_you_need_to_know,
        t.simple_version, t.formal_explanation, t.common_scenarios, t.your_rights,
        t.your_responsibilities, t.what_to_do, t.where_to_get_help, t.faq]);
    });
    stmt.finalize();
    console.log(`✅ Seeded: "${article.slug}" in 5 languages`);
  }

  setTimeout(() => { db.close(); console.log('✅ Seeding complete!'); }, 3000);
});
