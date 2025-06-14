import React from 'react';
import Team from '../components/Team';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-4xl font-bold text-center mb-6 text-orange-600">
        Tentang FoodSpot
      </h1>

      <p className="text-lg leading-relaxed mb-8 text-center text-gray-700">
        FoodSpot adalah platform digital yang bertujuan membantu pengguna
        menemukan restoran terbaik di Jakarta berdasarkan preferensi rasa,
        harga, dan suasana. Dengan sistem rekomendasi berbasis konten, kami
        berusaha memberikan pengalaman kuliner yang personal, sehat, dan
        menyenangkan.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            🎯 Visi
          </h2>
          <p className="text-sm text-gray-600">
            Menjadi referensi utama masyarakat urban dalam menemukan pengalaman
            kuliner yang lezat, sehat, dan berbasis teknologi.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            🌱 Misi
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>
              Menyediakan rekomendasi makanan berbasis pencarian dengan
              rekomendasi dari ai
            </li>
            <li>
              Menampilkan restoran autentik dengan deskripsi lengkap dan rating.
            </li>
            <li>
              Mempermudah eksplorasi kuliner lokal melalui fitur interaktif.
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            💡 Fitur Unggulan
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Rekomendasi berbasis preferensi.</li>
            <li>Filter menu berdasarkan rasa (manis, pedas, gurih).</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Dibuat oleh tim FoodSpot dengan cinta dan semangat inovasi.
        </p>
        <Team />
      </div>
    </div>
  ); 
}
