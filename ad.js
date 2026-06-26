//Module script type dictates that imports must be done in the js files not the html script tag
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

export function playad() {
  //pick random ad from ad folder
  //hardcode my fucking ass, this is gonna need updating with any ads that get added
  const ads = [
    'assets/ads/furry.png',
    'assets/ads/kirkingmyschmeet.webp',
    'assets/ads/onlyguys.webp',
    'assets/ads/residente.png',
    'assets/ads/sexysolitaire.webp'
  ];

  //Pick random ad then play it in Swal
  let ad = Math.floor(Math.random() * (ads.length - 1));

  Swal.fire({
    imageUrl: ads[ad],
    timer: 5000,
    text: 'Brought to you by Benjamin Netanyahu INC.',
    allowOutsideClick: false,
    showConfirmButton: false
  });
}
