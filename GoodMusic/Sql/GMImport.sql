USE [GoodMusic]
GO

DECLARE @import XML = N'
<gm>
  <users>
    <user>
      <id>10157068522865440</id>
      <forename>Pierre</forename>
      <surname>Henry</surname>
      <genderId>M</genderId>
      <ping>2016-09-02T11:51:20.0170000Z</ping>
      <genreId>2</genreId>
    </user>
  </users>
  <videos>
    <video>
      <id>1j3QHyBOyhg</id>
      <title>Polo Monta�ez - Un Monton De Estrellas (HD)</title>
      <thumbnail>https://i.ytimg.com/vi/1j3QHyBOyhg/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:53:51Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>1nFYDsPhWMI</id>
      <title>Stony - Danca Kizomba</title>
      <thumbnail>https://i.ytimg.com/vi/1nFYDsPhWMI/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:34:23Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>2qCLwI5ZNRA</id>
      <title>MARIO BARO - TE QUIERO</title>
      <thumbnail>https://i.ytimg.com/vi/2qCLwI5ZNRA/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:10:29Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>3VmoZrxXbmg</id>
      <title>Marc Anthony - Flor P�lida</title>
      <thumbnail>https://i.ytimg.com/vi/3VmoZrxXbmg/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:52:38Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>7d2wK4C-nRk</id>
      <title>Rei Helder - Ela j� Quer (Oficial) (Realiza��o: Wilsoldiers)</title>
      <thumbnail>https://i.ytimg.com/vi/7d2wK4C-nRk/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:29:20Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>7y45S6h0DEs</id>
      <title>Daniel Santacruz - Lo Dice La Gente (Audio)</title>
      <thumbnail>https://i.ytimg.com/vi/7y45S6h0DEs/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T22:08:37Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>AQr2KMpv_gE</id>
      <title>Yuri da Cunha feat Suzana Lubrano - SAGACIDADE NO AMOR (Official Video HD)</title>
      <thumbnail>https://i.ytimg.com/vi/AQr2KMpv_gE/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:26:23Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>AtbBtFo-e_s</id>
      <title>El Gran Combo - Arroz Con Habichuelas [HIGH QUALITY MUSIC]</title>
      <thumbnail>https://i.ytimg.com/vi/AtbBtFo-e_s/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:12:19Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>bgCaUiujdXM</id>
      <title>EL VERDE DE TUS OJOS [KIKO RODRIGUEZ]</title>
      <thumbnail>https://i.ytimg.com/vi/bgCaUiujdXM/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:50:21Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>EwA9NzCkqX0</id>
      <title>Yuri da Cunha - Eu cheiro bem</title>
      <thumbnail>https://i.ytimg.com/vi/EwA9NzCkqX0/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:28:33Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>FRUBI2Lw5J4</id>
      <title>Tony Dize - Super Heroe [Official Audio]</title>
      <thumbnail>https://i.ytimg.com/vi/FRUBI2Lw5J4/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T20:49:28Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>g4e1LfmYcFA</id>
      <title>Mambo Gallego by Tito Puente</title>
      <thumbnail>https://i.ytimg.com/vi/g4e1LfmYcFA/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:16:25Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>Gsz2Na3qyew</id>
      <title>ABRE QUE VOY - MIGUEL ENRIQUEZ</title>
      <thumbnail>https://i.ytimg.com/vi/Gsz2Na3qyew/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:20:52Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>Gy2OwjHxz7U</id>
      <title>LA MAXIMA 79  - LAPIZ Y PAPEL ( Official Video )</title>
      <thumbnail>https://i.ytimg.com/vi/Gy2OwjHxz7U/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:13:40Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>HdepIOmowfU</id>
      <title>Joan Soriano - Vocales de Amor</title>
      <thumbnail>https://i.ytimg.com/vi/HdepIOmowfU/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:38:59Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>HPvpJcR6ICc</id>
      <title>Hoja en Blanco - Monchy y Alexandra</title>
      <thumbnail>https://i.ytimg.com/vi/HPvpJcR6ICc/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:33:07Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>i8dNizlNwoY</id>
      <title>Hector Lavoe - Abuelita.</title>
      <thumbnail>https://i.ytimg.com/vi/i8dNizlNwoY/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:57:30Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>iiW5mpAbubQ</id>
      <title>New Swing Sextet - Maybe Then</title>
      <thumbnail>https://i.ytimg.com/vi/iiW5mpAbubQ/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:18:00Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>KNifUszz2zA</id>
      <title>Tito Puente Hong Kong Mambo ( 1958 ) .</title>
      <thumbnail>https://i.ytimg.com/vi/KNifUszz2zA/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:15:40Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>-lDsqOsJL7k</id>
      <title>Prince Royce - Culpa al Coraz�n (Official Video)</title>
      <thumbnail>https://i.ytimg.com/vi/-lDsqOsJL7k/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:11:26Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>MOysl6rVBdM</id>
      <title>Adele - Hello (salsa version by MANDINGA)</title>
      <thumbnail>https://i.ytimg.com/vi/MOysl6rVBdM/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-09-02T12:02:01.4970000Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>muVvjONiytQ</id>
      <title>Mbilia Bel - Douceur</title>
      <thumbnail>https://i.ytimg.com/vi/muVvjONiytQ/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:27:19Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>N8ytQ6RPjic</id>
      <title>LA MAXIMA 79 - LA GRIPE (Official Page)</title>
      <thumbnail>https://i.ytimg.com/vi/N8ytQ6RPjic/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:59:53Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>NOrfzcA6jzI</id>
      <title>LA MAXIMA 79 - POBRECITA</title>
      <thumbnail>https://i.ytimg.com/vi/NOrfzcA6jzI/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:58:26Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>NPbIA--_CpY</id>
      <title>IT''S JEAN "YO QUIERO SABER" LYRICS VIDEO</title>
      <thumbnail>https://i.ytimg.com/vi/NPbIA--_CpY/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:38:11Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>NzHsV4HTKoo</id>
      <title>LUIS VARGAS  - LOCO DE AMOR 1994</title>
      <thumbnail>https://i.ytimg.com/vi/NzHsV4HTKoo/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:39:33Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>PGzizFxT6hw</id>
      <title>No Hay Problema - Pink Martini</title>
      <thumbnail>https://i.ytimg.com/vi/PGzizFxT6hw/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:13:00Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>QFs3PIZb3js</id>
      <title>Romeo Santos - Propuesta Indecente (Official Video)</title>
      <thumbnail>https://i.ytimg.com/vi/QFs3PIZb3js/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T22:07:56Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>QFyDwilOTcg</id>
      <title>Jr. - Amarte Sin Amarte (OFFICIAL VIDEO)</title>
      <thumbnail>https://i.ytimg.com/vi/QFyDwilOTcg/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:18:54Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>tLVbV2XSQuQ</id>
      <title>"5 Minutos Mas" - Marco Puma - Official Video</title>
      <thumbnail>https://i.ytimg.com/vi/tLVbV2XSQuQ/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:36:35Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>TMq5USWW4vU</id>
      <title>Gente de Zona - Traidora (Salsa Version)[Cover Audio] ft. Marc Anthony</title>
      <thumbnail>https://i.ytimg.com/vi/TMq5USWW4vU/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:52:07Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>ueyURAcJPOI</id>
      <title>Plan B - Fan�tica Sensual (Bachata Version) | Prod. By Lone Lez</title>
      <thumbnail>https://i.ytimg.com/vi/ueyURAcJPOI/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-08-12T14:55:03.9130000Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>UN1lwFrDiBE</id>
      <title>MONCHY &amp; ALEXANDRA "No Es Una Novela"</title>
      <thumbnail>https://i.ytimg.com/vi/UN1lwFrDiBE/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:33:44Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>v5QXju-l6dE</id>
      <title>SALSA - NO LE PEGUE A LA NEGRA</title>
      <thumbnail>https://i.ytimg.com/vi/v5QXju-l6dE/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T22:06:34Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>X5AxN4pv5vE</id>
      <title>Andy &amp; Lucas - Son De Amores (Version Salsa)</title>
      <thumbnail>https://i.ytimg.com/vi/X5AxN4pv5vE/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:14:25Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>XDdHgVKt-HU</id>
      <title>Saaphy - Side 2 Side (Official Video)</title>
      <thumbnail>https://i.ytimg.com/vi/XDdHgVKt-HU/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:54:50Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>yI2ftVFpFds</id>
      <title>Grupo Extra - Besos a Escondidas - #BACHATA 2016</title>
      <thumbnail>https://i.ytimg.com/vi/yI2ftVFpFds/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T23:10:45Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>yUAZxs3qY3Y</id>
      <title>Prince Royce - Te Robar�</title>
      <thumbnail>https://i.ytimg.com/vi/yUAZxs3qY3Y/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:33:45Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
    <video>
      <id>zM5bRA74-34</id>
      <title>LA MAXIMA 79  - SINGAPORE VIBES (Official Video)</title>
      <thumbnail>https://i.ytimg.com/vi/zM5bRA74-34/mqdefault.jpg</thumbnail>
      <dateRecommended>2016-07-21T21:59:08Z</dateRecommended>
      <userId>10157068522865440</userId>
    </video>
  </videos>
  <reviews>
    <review>
      <videoId>1j3QHyBOyhg</videoId>
      <genreId>1</genreId>
      <styleId>3</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:53:51Z</dateReviewed>
    </review>
    <review>
      <videoId>1j3QHyBOyhg</videoId>
      <genreId>1</genreId>
      <styleId>5</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:53:51Z</dateReviewed>
    </review>
    <review>
      <videoId>1nFYDsPhWMI</videoId>
      <genreId>3</genreId>
      <styleId>12</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:34:23Z</dateReviewed>
    </review>
    <review>
      <videoId>2qCLwI5ZNRA</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:09:55Z</dateReviewed>
    </review>
    <review>
      <videoId>2qCLwI5ZNRA</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:10:30Z</dateReviewed>
    </review>
    <review>
      <videoId>3VmoZrxXbmg</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:52:38Z</dateReviewed>
    </review>
    <review>
      <videoId>7d2wK4C-nRk</videoId>
      <genreId>3</genreId>
      <styleId>13</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:29:20Z</dateReviewed>
    </review>
    <review>
      <videoId>7y45S6h0DEs</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:08:37Z</dateReviewed>
    </review>
    <review>
      <videoId>7y45S6h0DEs</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:08:37Z</dateReviewed>
    </review>
    <review>
      <videoId>7y45S6h0DEs</videoId>
      <genreId>2</genreId>
      <styleId>10</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:08:37Z</dateReviewed>
    </review>
    <review>
      <videoId>AQr2KMpv_gE</videoId>
      <genreId>3</genreId>
      <styleId>11</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:26:23Z</dateReviewed>
    </review>
    <review>
      <videoId>AtbBtFo-e_s</videoId>
      <genreId>4</genreId>
      <styleId>14</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:12:19Z</dateReviewed>
    </review>
    <review>
      <videoId>bgCaUiujdXM</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:50:21Z</dateReviewed>
    </review>
    <review>
      <videoId>EwA9NzCkqX0</videoId>
      <genreId>3</genreId>
      <styleId>13</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:28:33Z</dateReviewed>
    </review>
    <review>
      <videoId>FRUBI2Lw5J4</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T20:49:28Z</dateReviewed>
    </review>
    <review>
      <videoId>FRUBI2Lw5J4</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T20:49:28Z</dateReviewed>
    </review>
    <review>
      <videoId>g4e1LfmYcFA</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:16:25Z</dateReviewed>
    </review>
    <review>
      <videoId>Gsz2Na3qyew</videoId>
      <genreId>1</genreId>
      <styleId>3</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:20:52Z</dateReviewed>
    </review>
    <review>
      <videoId>Gsz2Na3qyew</videoId>
      <genreId>1</genreId>
      <styleId>4</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:20:52Z</dateReviewed>
    </review>
    <review>
      <videoId>Gy2OwjHxz7U</videoId>
      <genreId>4</genreId>
      <styleId>14</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:13:40Z</dateReviewed>
    </review>
    <review>
      <videoId>HdepIOmowfU</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:38:59Z</dateReviewed>
    </review>
    <review>
      <videoId>HPvpJcR6ICc</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:33:07Z</dateReviewed>
    </review>
    <review>
      <videoId>HPvpJcR6ICc</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:33:07Z</dateReviewed>
    </review>
    <review>
      <videoId>i8dNizlNwoY</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:57:30Z</dateReviewed>
    </review>
    <review>
      <videoId>iiW5mpAbubQ</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:18:00Z</dateReviewed>
    </review>
    <review>
      <videoId>KNifUszz2zA</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:15:40Z</dateReviewed>
    </review>
    <review>
      <videoId>-lDsqOsJL7k</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:11:26Z</dateReviewed>
    </review>
    <review>
      <videoId>-lDsqOsJL7k</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:11:26Z</dateReviewed>
    </review>
    <review>
      <videoId>MOysl6rVBdM</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-09-02T12:02:01.5000000Z</dateReviewed>
    </review>
    <review>
      <videoId>MOysl6rVBdM</videoId>
      <genreId>1</genreId>
      <styleId>3</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-09-02T12:02:01.5000000Z</dateReviewed>
    </review>
    <review>
      <videoId>muVvjONiytQ</videoId>
      <genreId>3</genreId>
      <styleId>11</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:27:19Z</dateReviewed>
    </review>
    <review>
      <videoId>N8ytQ6RPjic</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:59:53Z</dateReviewed>
    </review>
    <review>
      <videoId>N8ytQ6RPjic</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:59:53Z</dateReviewed>
    </review>
    <review>
      <videoId>NOrfzcA6jzI</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:58:26Z</dateReviewed>
    </review>
    <review>
      <videoId>NOrfzcA6jzI</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:58:26Z</dateReviewed>
    </review>
    <review>
      <videoId>NPbIA--_CpY</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:38:11Z</dateReviewed>
    </review>
    <review>
      <videoId>NPbIA--_CpY</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:38:11Z</dateReviewed>
    </review>
    <review>
      <videoId>NzHsV4HTKoo</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:39:33Z</dateReviewed>
    </review>
    <review>
      <videoId>PGzizFxT6hw</videoId>
      <genreId>4</genreId>
      <styleId>14</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:13:00Z</dateReviewed>
    </review>
    <review>
      <videoId>QFs3PIZb3js</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:07:56Z</dateReviewed>
    </review>
    <review>
      <videoId>QFs3PIZb3js</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:07:56Z</dateReviewed>
    </review>
    <review>
      <videoId>QFs3PIZb3js</videoId>
      <genreId>2</genreId>
      <styleId>10</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:07:56Z</dateReviewed>
    </review>
    <review>
      <videoId>QFyDwilOTcg</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:18:54Z</dateReviewed>
    </review>
    <review>
      <videoId>QFyDwilOTcg</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:18:54Z</dateReviewed>
    </review>
    <review>
      <videoId>tLVbV2XSQuQ</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:36:35Z</dateReviewed>
    </review>
    <review>
      <videoId>tLVbV2XSQuQ</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:36:35Z</dateReviewed>
    </review>
    <review>
      <videoId>TMq5USWW4vU</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:52:07Z</dateReviewed>
    </review>
    <review>
      <videoId>TMq5USWW4vU</videoId>
      <genreId>1</genreId>
      <styleId>3</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:52:07Z</dateReviewed>
    </review>
    <review>
      <videoId>ueyURAcJPOI</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-08-12T14:55:03.9130000Z</dateReviewed>
    </review>
    <review>
      <videoId>ueyURAcJPOI</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-08-12T14:55:03.9130000Z</dateReviewed>
    </review>
    <review>
      <videoId>UN1lwFrDiBE</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:33:44Z</dateReviewed>
    </review>
    <review>
      <videoId>UN1lwFrDiBE</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:33:44Z</dateReviewed>
    </review>
    <review>
      <videoId>v5QXju-l6dE</videoId>
      <genreId>1</genreId>
      <styleId>6</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T22:06:34Z</dateReviewed>
    </review>
    <review>
      <videoId>X5AxN4pv5vE</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:14:25Z</dateReviewed>
    </review>
    <review>
      <videoId>X5AxN4pv5vE</videoId>
      <genreId>1</genreId>
      <styleId>3</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:14:25Z</dateReviewed>
    </review>
    <review>
      <videoId>XDdHgVKt-HU</videoId>
      <genreId>3</genreId>
      <styleId>12</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:54:50Z</dateReviewed>
    </review>
    <review>
      <videoId>yI2ftVFpFds</videoId>
      <genreId>2</genreId>
      <styleId>7</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-09-01T10:44:16.0400000Z</dateReviewed>
    </review>
    <review>
      <videoId>yI2ftVFpFds</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:10:45Z</dateReviewed>
    </review>
    <review>
      <videoId>yI2ftVFpFds</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T23:10:45Z</dateReviewed>
    </review>
    <review>
      <videoId>yUAZxs3qY3Y</videoId>
      <genreId>2</genreId>
      <styleId>8</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:33:45Z</dateReviewed>
    </review>
    <review>
      <videoId>yUAZxs3qY3Y</videoId>
      <genreId>2</genreId>
      <styleId>9</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:33:45Z</dateReviewed>
    </review>
    <review>
      <videoId>zM5bRA74-34</videoId>
      <genreId>1</genreId>
      <styleId>1</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:59:08Z</dateReviewed>
    </review>
    <review>
      <videoId>zM5bRA74-34</videoId>
      <genreId>1</genreId>
      <styleId>2</styleId>
      <userId>10157068522865440</userId>
      <like>1</like>
      <dateReviewed>2016-07-21T21:59:08Z</dateReviewed>
    </review>
  </reviews>
</gm>'

EXEC [apiImport] @import, 1
GO

-- Randomize review dates
UPDATE [review] SET [dateReviewed] = DATEADD(minute, CHECKSUM(NEWID()) % 1000000, GETUTCDATE())
GO
