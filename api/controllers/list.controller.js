import List from "../models/list.model.js";
import { errorHandler } from '../utils/error.js';


export const createList = async (req, res, next) => {
    try {
        const list = await List.create(req.body);
        return res.status(201).json(list);

    } catch (error) {
        next(error);
    }
}

export const deleteList = async (req, res, next) => {
    const list = await List.findById(req.params.id);
    if (!list) {
        return next(errorHandler(404, "List not found"));
    }
    if (req.user.id !== list.userRef) {
        return next(errorHandler(401, "You can only delete your own list"));
    }
    try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json("List has been deleted");
    } catch (error) {
        next(error);
    }
}

export const updateList = async (req, res, next) => {
    const list = await List.findById(req.params.id);
    if (!list) {
        return next(errorHandler(404, "List not found"));
    }
    if (req.user.id !== list.userRef) {
        return next(errorHandler(401, "You can only update your own list"));
    }
    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedList);
    } catch (error) {
        next(error);
    }
}

export const getList = async (req, res, next) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return next(errorHandler(404, "List not found"));
        }

        // Cari rekomendasi berdasarkan jenis makanan yang sama
        const recommendations = await List.find({
            type: list.type,
            _id: { $ne: list._id } // exclude restoran yang sedang dilihat
        })
            .sort({ rating: -1 })
            .limit(4);

        // Tambahkan similarity score dummy
        const recommendationsWithScore = recommendations.map(resto => {
            const doc = resto.toObject();
            // Buat similarity score berdasarkan rating
            const baseScore = 0.5;
            const ratingFactor = (resto.rating / 5) * 0.4; // Maksimal 0.4 dari rating
            doc.similarity_score = (baseScore + ratingFactor).toFixed(2);
            return doc;
        });

        // Kembalikan data restoran beserta rekomendasi
        res.status(200).json({
            listData: list,
            recommendations: recommendationsWithScore
        });
    } catch (error) {
        next(error);
    }
}

export const getLists = async (req, res, next) => {
    try {
        console.log("getLists called with query:", req.query);
        
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const useML = req.query.useML === 'true';
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        // Handle type multiple values
        let type = req.query.type;
        let typeFilter;
        if (!type || type === 'all') {
          typeFilter = { $exists: true }; // semua type
        } else {
          // split jadi array, trim spasi
          const typeArray = type.split(',').map(t => t.trim());
          typeFilter = { $in: typeArray };
        }

        // Harga filter
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

        // Rating filter
        const minRating = parseFloat(req.query.minRating) || 0;

        // Search di name dan description sekaligus dengan regex case insensitive
        const regex = { $regex: searchTerm, $options: 'i' };

        // Lakukan pencarian biasa untuk semua kasus
        const lists = await List.find({
          type: typeFilter,
          price: { $gte: minPrice, $lte: maxPrice },
          rating: { $gte: minRating },
          $or: [
            { name: regex },
            { description: regex },
            { address: regex }
          ]
        })
          .sort({ [sort]: order })
          .limit(limit)
          .skip(startIndex);
        
        // Jika ML tidak diaktifkan atau tidak ada searchTerm, kembalikan hasil pencarian biasa saja
        if (!useML || !searchTerm) {
          return res.status(200).json(lists);
        }

        // Analisis kata kunci pencarian untuk menentukan strategi rekomendasi
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Kata kunci terkait harga
        const priceKeywords = ['murah', 'mahal', 'terjangkau', 'ekonomis', 'hemat', 'mewah', 'premium'];
        // Kata kunci terkait rating
        const ratingKeywords = ['enak', 'lezat', 'nikmat', 'terbaik', 'favorit', 'populer', 'terkenal'];
        
        let recommendations = [];
        let matchType = '';
        let matchDescription = '';
        
        // Strategi 1: Jika kata kunci terkait harga
        if (priceKeywords.some(keyword => lowerSearchTerm.includes(keyword))) {
          // Jika mencari yang murah
          if (['murah', 'terjangkau', 'ekonomis', 'hemat'].some(keyword => lowerSearchTerm.includes(keyword))) {
            recommendations = await List.find()
              .sort({ price: 1 }) // Urutkan dari yang termurah
              .limit(5);
            matchType = 'price_low';
            matchDescription = 'harga terjangkau';
          } 
          // Jika mencari yang mahal/premium
          else if (['mahal', 'mewah', 'premium'].some(keyword => lowerSearchTerm.includes(keyword))) {
            recommendations = await List.find()
              .sort({ price: -1 }) // Urutkan dari yang termahal
              .limit(5);
            matchType = 'price_high';
            matchDescription = 'premium';
          }
        }
        // Strategi 2: Jika kata kunci terkait rating/kualitas
        else if (ratingKeywords.some(keyword => lowerSearchTerm.includes(keyword))) {
          recommendations = await List.find()
            .sort({ rating: -1 }) // Urutkan dari rating tertinggi
            .limit(5);
          matchType = 'rating';
          matchDescription = 'rating tinggi';
        }
        // Strategi 3: Default - gunakan hasil pencarian sebagai dasar rekomendasi
        else {
          // Jika ada hasil pencarian, gunakan restoran pertama sebagai dasar
          if (lists.length > 0) {
            const firstResult = lists[0];
            recommendations = await List.find({
              _id: { $ne: firstResult._id },
              $or: [
                { type: { $regex: firstResult.type, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
              ]
            })
              .sort({ rating: -1 })
              .limit(5);
            matchType = 'search_result';
            matchDescription = 'relevan dengan pencarian Anda';
          } 
          // Jika tidak ada hasil, berikan rekomendasi populer
          else {
            recommendations = await List.find()
              .sort({ rating: -1 })
              .limit(5);
            matchType = 'popular';
            matchDescription = 'populer';
          }
        }
        
        // Tambahkan similarity score
        const recommendationsWithScore = recommendations.map(resto => {
          const doc = resto.toObject();
          // Buat similarity score berdasarkan relevansi dengan pencarian
          let score = 0.5; // Base score
          
          // Tambahkan skor berdasarkan kecocokan dengan kata kunci
          if (resto.description.toLowerCase().includes(lowerSearchTerm)) {
            score += 0.2;
          }
          if (resto.name.toLowerCase().includes(lowerSearchTerm)) {
            score += 0.2;
          }
          
          // Tambahkan variasi acak kecil
          const randomFactor = Math.random() * 0.1;
          score = Math.min(0.9, score + randomFactor);
          
          doc.similarity_score = score.toFixed(2);
          return doc;
        });
        
        return res.status(200).json({
          results: lists,
          ml: {
            enabled: true,
            type: 'recommendation',
            query: searchTerm,
            match_type: matchType,
            matchDescription: matchDescription,
            recommendations: recommendationsWithScore
          }
        });
        
    } catch (error) {
        console.error("Error in getLists:", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error processing search request',
            error: error.message
        });
    }
}