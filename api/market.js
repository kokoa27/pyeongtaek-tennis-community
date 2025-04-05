const firebase = require('../config/firebase');

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = firebase.firestore();
    const marketItemsCollection = db.collection('marketItems');

    // URL 파싱
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const category = url.searchParams.get('category');
    
    // 상품 목록 가져오기
    if (req.method === 'GET' && pathSegments.length === 1) {
      let query = marketItemsCollection.orderBy('createdAt', 'desc');
      
      // 카테고리 필터링
      if (category && category !== 'all') {
        query = query.where('category', '==', category);
      }
      
      const snapshot = await query.get();
      const items = [];
      
      snapshot.forEach(doc => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json(items);
    }
    
    // 상품 상세 정보 가져오기
    if (req.method === 'GET' && pathSegments.length === 2) {
      const itemId = pathSegments[1];
      
      const itemDoc = await marketItemsCollection.doc(itemId).get();
      
      if (!itemDoc.exists) {
        return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
      }
      
      return res.status(200).json({
        id: itemDoc.id,
        ...itemDoc.data()
      });
    }
    
    // 새 상품 등록
    if (req.method === 'POST' && pathSegments.length === 1) {
      const { title, description, price, category, condition, imageUrl, contact, seller, createdAt } = req.body;
      
      // 필수 필드 검증
      if (!title || !description || isNaN(price) || !category || !condition || !seller) {
        return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
      }
      
      // 새 상품 데이터
      const newItem = {
        title,
        description,
        price: Number(price),
        category,
        condition,
        imageUrl: imageUrl || '',
        contact: contact || '',
        seller,
        createdAt: createdAt || new Date().toISOString()
      };
      
      // Firestore에 저장
      const docRef = await marketItemsCollection.add(newItem);
      
      return res.status(201).json({
        id: docRef.id,
        ...newItem
      });
    }
    
    // 지원하지 않는 메서드 처리
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
    
  } catch (error) {
    console.error('마켓 API 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
