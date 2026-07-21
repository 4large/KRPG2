//Module script type dictates that imports must be done in the js files not the html script tag
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

export async function playad(fuckYou) {
  //pick random ad from ad folder
  //hardcode my fucking ass, this is gonna need updating with any ads that get added
  const ads = [
    'assets/ads/furry.png',
    'assets/ads/kirkingmyschmeet.webp',
    'assets/ads/onlyguys.webp',
    'assets/ads/residente.png',
    'assets/ads/sexysolitaire.webp',
    'assets/ads/FakeNews.jpg',
    'assets/ads/jimmyrpe.jpg',
    'assets/ads/hapa.png',
    'assets/ads/feinwashed.webp',
    'assets/ads/yahu_is_our_savior.webp',
    'assets/ads/coolest_ad_ever.webp',
    'assets/ads/french.webp',
    'assets/ads/jimmygay.png',
    'assets/ads/Cocter.png',
    'assets/ads/noahbissofuckinggay.jpg',
    'assets/ads/saucy.png',
    'assets/ads/jimmyisverymean.jpg'
  ];

  //Pick random ad then play it in Swal
  let ad = Math.floor(Math.random() * (ads.length));

  Swal.fire({
    imageUrl: ads[ad],
    timer: 5000,
    text: fuckYou,
    allowOutsideClick: false,
    showConfirmButton: false
  });

  await wait();
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 5500));
}
