/**
 * Master GSAP Scroll Timeline for Chakravyuh (13 Narrative Stages)
 * Choreographed to the Netflix Kurukshetra Chakravyuh sequence.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const STAGES = [
  {
    id: 1,
    start: 0.0,
    end: 0.08,
    eyebrow: 'Kurukshetra · Day 13',
    heading: 'The Deadly Chakravyuh.',
    hindi: 'तेरहवाँ दिन, कुरुक्षेत्र — द्रोणाचार्य ने रचा सात चक्रों का अभेद्य चक्रव्यूह।',
    caption: 'Drona arrays seven rotating rings of tower shields, war elephants, and steel.',
    quote: '“न हि तं वेत्ति योद्धुं वै पार्थेन सदृशो रणे।” — केवल अर्जुन ही इस व्यूह का भेद जानते थे। (द्रोण पर्व)'
  },
  {
    id: 2,
    start: 0.08,
    end: 0.16,
    eyebrow: 'Jayadratha’s Gate',
    heading: '“Let Them In.”',
    hindi: 'सिंधुराज जयद्रथ ने खोला प्रवेश द्वार — कौरवों का घातक जाल तैयार था।',
    caption: '“This is why we created this gateway to hell.” The outer shield corridor opens.',
    quote: '“अहं वारयिता पार्थानृते पार्थं महाबलम्।” — अर्जुन के सिवा मैं सभी पांडवों को रोक लूँगा। (जयद्रथ)'
  },
  {
    id: 3,
    start: 0.16,
    end: 0.25,
    eyebrow: 'The Young Lion Charges',
    heading: 'Into the Shield Corridor.',
    hindi: 'अर्जुन की अनुपस्थिति में सोलह वर्षीय अभिमन्यु अकेला ही व्यूह में कूद पड़ा।',
    caption: 'Abhimanyu’s golden chariot, royal chatra, and crimson pennant thunder through the breach.',
    quote: '“प्रविशामि महाव्यूहं भित्वा शत्रून् रणाजिरे।” — आज शत्रुओं को चीरकर मैं इस महाव्यूह में प्रवेश करूँगा।'
  },
  {
    id: 4,
    start: 0.25,
    end: 0.34,
    eyebrow: 'Ring I · Tower-Shield Wall',
    heading: '“Steer Clear of the Shields!”',
    hindi: 'प्रथम चक्र की विशाल ढालों को चीरता हुआ अभिमन्यु का रथ भीतर बढ़ा।',
    caption: 'Bronzed chakra-embossed tower shields tower on either side as the chariot races inward.',
    quote: '“प्रवेशं चात्र जानामि न तु निष्क्रमणं रणे।” — माता के गर्भ में मैंने केवल प्रवेश की विद्या सुनी थी।'
  },
  {
    id: 5,
    start: 0.34,
    end: 0.43,
    eyebrow: 'Jayadratha Seals the Path',
    heading: '“Now Find Your Way Out If You Can!”',
    hindi: 'अभिमन्यु के भीतर जाते ही जयद्रथ ने बाहर का मार्ग बंद कर दिया — पांडव बाहर ही रह गए।',
    caption: 'Giant shield-bearers march shut behind him, trapping Bheem and the Pandavas outside.',
    quote: '“द्वारं निरुद्धं पार्थस्य सैन्धवेन महात्मना।” — जयद्रथ के वरदान ने पांडवों का मार्ग अवरुद्ध कर दिया।'
  },
  {
    id: 6,
    start: 0.43,
    end: 0.52,
    eyebrow: 'Ring II · Gold-Armoured Elephants',
    heading: 'Shattering the Elephant Wall.',
    hindi: 'द्वितीय चक्र में स्वर्ण-कवचधारी गजसेना को ध्वस्त कर वीर आगे बढ़ा।',
    caption: 'Abhimanyu leaps above the tusker phalanx, breaking through the second circle.',
    quote: '“हस्तिव्यूहं विदार्याशु सौभद्रः परवीरहा।” — गजसेना को विदीर्ण कर सुभद्रा-नंदन आगे बढ़ गया।'
  },
  {
    id: 7,
    start: 0.52,
    end: 0.60,
    eyebrow: 'Rings III & IV · Cavalry & Chariots',
    heading: 'An Endless Labyrinth.',
    hindi: 'घूमती हुई अश्व और रथ सेनाओं के बीच अभिमन्यु ने अकेले ही पथ बनाया।',
    caption: 'Each ring turns in counter-motion; he carves a blazing trail deeper into the spiral.',
    quote: '“रथाश्वपत्तिसङ्घांश्च व्यधमत् तान् सहस्रशः।” — हज़ारों रथियों और अश्वारोहियों को उसने क्षण में पछाड़ दिया।'
  },
  {
    id: 8,
    start: 0.60,
    end: 0.68,
    eyebrow: 'Rings V & VI · Archers & Inner Shields',
    heading: 'Through the Storm of Arrows.',
    hindi: 'बाणों की घनघोर वर्षा में भी अभिमन्यु ने पाँचवाँ और छठा चक्र भेद डाला।',
    caption: 'Arrows graze his shoulder as he pierces the inner shield wall alone.',
    quote: '“असम्प्रहार्यः स रणे बालोऽपि बलिनां वरः।” — बालक होते हुए भी वह रणभूमि में अजेय प्रतीत होता था।'
  },
  {
    id: 9,
    start: 0.68,
    end: 0.77,
    eyebrow: 'The Dusty Centre',
    heading: '“Uncle Bheem!”',
    hindi: 'चक्रव्यूह के केंद्र में धूल के बवंडर के बीच अभिमन्यु ने देखा — पीछे कोई सहायता नहीं।',
    caption: 'The chariot slows in swirling red-ochre dust. No Pandava is behind him.',
    quote: '“एकाकी स रणे शूरः परिवव्रे महारथैः।” — केंद्र में पहुँचकर वह अकेला महारथियों से घिर गया।'
  },
  {
    id: 10,
    start: 0.77,
    end: 0.85,
    eyebrow: 'Eight Maharathis Emerge',
    heading: '“Use Weapons, Not Words!”',
    hindi: '“कायरों, शब्दों से नहीं शस्त्रों से युद्ध करो!” — आठ महारथियों के सामने एक वीर बालक।',
    caption: 'Surrounded by Drona, Karna, Kripa, Ashwatthama, Duryodhana, Kritavarma, Shakuni, and Lakshman.',
    quote: '“सप्तभिः सहिताः सर्वे महारथाः परंतपाः।” — युद्ध-धर्म भूलकर सभी महारथी एक साथ टूट पड़े।'
  },
  {
    id: 11,
    start: 0.85,
    end: 0.91,
    eyebrow: 'Blue-Arc Sword Fury',
    heading: 'Duryodhana’s Son Falls.',
    hindi: 'दुर्योधन के पुत्र लक्ष्मण को भी अभिमन्यु ने अपने प्रचंड प्रहार से धराशायी कर दिया।',
    caption: 'Lakshman steps forward with his golden mace—and falls beneath Abhimanyu’s blazing blade.',
    quote: '“लक्ष्मणं निजघानैको दुर्योधनसुतं बली।” — महाबली अभिमन्यु ने लक्ष्मण का वध कर दिया।'
  },
  {
    id: 12,
    start: 0.91,
    end: 0.96,
    eyebrow: 'Dharma Broken · The Encirclement',
    heading: 'The Chariot Shattered.',
    hindi: 'कौरवों ने युद्ध-धर्म तोड़ा — कर्ण ने पीछे से धनुष काटा, रथ टूटा, फिर भी पहिया उठाकर वीर गरज उठा।',
    caption: 'Deprived of his bow, steeds, and chariot, the lone lion lifts the massive 16-spoked battle wheel as his shield against all eight kings.',
    quote: '“रथचक्रं समुद्यम्य द्रोणकर्णमुखान् ययौ।” — रथहीन होकर भी उसने पहिये को अस्त्र बना लिया।'
  },
  {
    id: 13,
    start: 0.96,
    end: 1.0,
    eyebrow: 'Drona Parva · Final Breath',
    heading: 'The Immortal Martyr.',
    hindi: 'अंतिम श्वास तक चक्रव्यूह में धर्म की रक्षा करता रहा — आकाश से देवताओं ने पुष्प बरसाए, अमर हो गया अभिमन्यु।',
    caption: 'Holding the divine chariot wheel high against adharma, his sacred soul ascends in celestial glory as divine flowers rain from heaven.',
    quote: '“यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः” — उसका तेज और बलिदान सदा के लिए अमर हो गया।'
  }
];

export function createMasterTimeline({ rings, ui, onProgress }) {
  const state = { progress: 0 };
  let gapsSealed = false;

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.15,
      onUpdate: (self) => {
        const p = self.progress;
        state.progress = p;
        if (onProgress) onProgress(p);
        ui.update(p);

        // Open funnel gate at Stage 2-4, then slam Ring 1 shut at Stage 5 (p >= 0.35)!
        if (p >= 0.68) {
          if (!gapsSealed) {
            rings.closeAllGaps();
            gapsSealed = true;
          }
        } else if (p >= 0.12 && p < 0.68) {
          gapsSealed = false;
          const normalized = (p - 0.12) / (0.68 - 0.12);
          const activeRing = Math.min(6, Math.floor(normalized * 7));
          for (let r = 0; r < 7; r++) {
            // Once past p=0.35, seal Ring 0 (outer shield wall) behind Abhimanyu!
            if (r === 0 && p >= 0.35) {
              rings.closeGap(0);
            } else if (r === activeRing || r === activeRing - 1) {
              rings.openGap(r, 0);
            } else {
              rings.closeGap(r);
            }
          }
        } else {
          rings.closeAllGaps();
        }
      }
    }
  });

  masterTl.to(state, {
    progress: 1,
    duration: 1,
    ease: 'none'
  });

  return { masterTl, state };
}

export default { STAGES, createMasterTimeline };
