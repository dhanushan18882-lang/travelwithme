import React from 'react';

<<<<<<< HEAD
// Using consistent nature/travel themed images from picsum
const images = [
  "https://picsum.photos/id/1018/800/600",
  "https://picsum.photos/id/1015/600/800",
  "https://picsum.photos/id/1016/800/600",
  "https://picsum.photos/id/1029/800/600",
  "https://picsum.photos/id/1040/800/600",
  "https://picsum.photos/id/164/800/600",
=======
// Local gallery images — place originals in public/images/
const images = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
];

export const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="font-serif text-4xl text-stone-900 font-medium">Gallery</h3>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto">
            A glimpse into the breathtaking landscapes and vibrant culture of our island home.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1 */}
            <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[0]} alt="Gallery 1" />
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[1]} alt="Gallery 2" />
                </div>
            </div>
            {/* Column 2 */}
            <div className="grid gap-4">
                 <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[2]} alt="Gallery 3" />
                </div>
                 <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[3]} alt="Gallery 4" />
                </div>
            </div>
             {/* Column 3 */}
             <div className="grid gap-4">
                 <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[4]} alt="Gallery 5" />
                </div>
                 <div className="relative overflow-hidden rounded-xl group">
                    <img className="h-auto max-w-full rounded-xl transition-transform duration-700 group-hover:scale-105" src={images[5]} alt="Gallery 6" />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
