import React from "react";

const teamMembers = [
  {
    name: "Rais Akbar Wibowo",
    role: "Fullstack Developer (FEBE)",
    id: "FC267D5Y0333",
    bio: "Bertanggung jawab membangun tampilan antarmuka pengguna dan sistem backend untuk integrasi data serta alur rekomendasi makanan.",
  },
  {
    name: "Daffa Muhamad Farid",
    role: "Machine Learning Engineer",
    id: "MC823D5Y0027",
    bio: "Mengembangkan model rekomendasi makanan berbasis content-based filtering serta membantu integrasi dengan data kesehatan.",
  },
  {
    name: "Adinda Chandra Ayu Kusumawardhana",
    role: "Machine Learning Engineer",
    id: "MC009D5X0392",
    bio: "Mengelola preprocessing data restoran dan merancang sistem klasifikasi jenis makanan berdasarkan fitur kesehatan.",
  },
  {
    name: "Muhamad Fajri Permana Haryanto",
      role: "Machine Learning Engineer",
    id: "MC204D5Y0525",
    bio: "Fokus pada training dan evaluasi model machine learning serta optimisasi pipeline analitik data pengguna.",
  },
];

export default function Team() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-slate-700 mb-10">
        Our Developers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl shadow-sm hover:shadow-md transition p-6"
          >
            <h3 className="text-xl font-semibold text-orange-600">
              {member.name}
            </h3>
                <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 mb-2">{member.id}</p>
                
            <p className="text-gray-700 text-sm text-justify">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
