#!/usr/bin/env python3
import subprocess
import os
import shutil

SHLOKAS = [
    {
        "id": 1,
        "text": "न हि तं वेत्ति योद्धुं वै पार्थेन सदृशो रणे।",
        "translit": "Na hi tam vetti yoddhum vai parthen sadrisho rane"
    },
    {
        "id": 2,
        "text": "अहं वारयिता पार्थानृते पार्थं महाबलम्।",
        "translit": "Aham vaarayita parthan rite partham mahabalam"
    },
    {
        "id": 3,
        "text": "प्रविशामि महाव्यूहं भित्वा शत्रून् रणाजिरे।",
        "translit": "Pravishami mahavyuham bhitva shatrun ranajire"
    },
    {
        "id": 4,
        "text": "प्रवेशं चात्र जानामि न तु निष्क्रमणं रणे।",
        "translit": "Pravesham chatra janami na tu nishkramanam rane"
    },
    {
        "id": 5,
        "text": "द्वारं निरुद्धं पार्थस्य सैन्धवेन महात्मना।",
        "translit": "Dvaram niruddham parthasya saindhavena mahatmana"
    },
    {
        "id": 6,
        "text": "हस्तिव्यूहं विदार्याशु सौभद्रः परवीरहा।",
        "translit": "Hastivyuham vidaryashu saubhadrah paraveeraha"
    },
    {
        "id": 7,
        "text": "रथाश्वपत्तिसङ्घांश्च व्यधमत् तान् सहस्रशः।",
        "translit": "Rathashvapattisanghamshcha vyadhamat tan sahasrashah"
    },
    {
        "id": 8,
        "text": "असम्प्रहार्यः स रणे बालोऽपि बलिनां वरः।",
        "translit": "Asampraharyah sa rane balo'pi balinam varah"
    },
    {
        "id": 9,
        "text": "एकाकी स रणे शूरः परिवव्रे महारथैः।",
        "translit": "Ekaki sa rane shurah parivavre maharathaih"
    },
    {
        "id": 10,
        "text": "सप्तभिः सहिताः सर्वे महारथाः परंतपाः।",
        "translit": "Saptabhih sahitah sarve maharathah parantapah"
    },
    {
        "id": 11,
        "text": "लक्ष्मणं निजघानैको दुर्योधनसुतं बली।",
        "translit": "Lakshmanam nijaghanaiko duryodhanasutam bali"
    },
    {
        "id": 12,
        "text": "रथचक्रं समुद्यम्य द्रोणकर्णमुखान् ययौ।",
        "translit": "Rathachakram samudyamya dronakarnamukhan yayau"
    },
    {
        "id": 13,
        "text": "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।",
        "translit": "Yatra yogeshvarah krishno yatra partho dhanurdharah"
    }
]

out_dir = os.path.abspath("public/audio/shlokas")
os.makedirs(out_dir, exist_ok=True)
tmp_dir = "/tmp/shloka_build"
os.makedirs(tmp_dir, exist_ok=True)

for item in SHLOKAS:
    sid = item["id"]
    text = item["text"]
    wav_path = os.path.join(tmp_dir, f"stage_{sid}.wav")
    mp3_path = os.path.join(out_dir, f"stage_{sid}.mp3")
    
    print(f"Generating stage {sid}: {text}")
    # Use say with Lekha voice, -r 130 for solemn Vedic chanting cadence
    cmd_say = [
        "say",
        "-v", "Lekha",
        "-r", "130",
        "-o", wav_path,
        "--file-format=WAVE",
        "--data-format=LEI16@22050",
        text
    ]
    res = subprocess.run(cmd_say, capture_output=True)
    if res.returncode != 0:
        print(f"Error on say for {sid}: {res.stderr.decode()}")
        continue

    # Process with ffmpeg: resonant acoustic battlefield echo + warmth
    # aecho parameters: in_gain:out_gain:delays:decays
    # bass filter adds deep vocal resonance
    af = "aresample=44100,volume=1.45,aecho=0.85:0.75:50|110:0.35|0.2,bass=g=5:f=180"
    cmd_ff = [
        "ffmpeg", "-y",
        "-i", wav_path,
        "-af", af,
        "-c:a", "libmp3lame",
        "-b:a", "128k",
        mp3_path
    ]
    res_ff = subprocess.run(cmd_ff, capture_output=True)
    if res_ff.returncode == 0:
        sz = os.path.getsize(mp3_path)
        print(f"Successfully generated stage_{sid}.mp3 ({sz} bytes)")
    else:
        print(f"Error on ffmpeg for {sid}: {res_ff.stderr.decode()}")

print("Done generating shloka vocal audio files!")
