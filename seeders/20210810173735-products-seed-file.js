'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        name: 'BC-SUMMIT 浮力調整背心',
        description: 'Aropec 浮力調整背心',
        price: 13500,
        image: '/products/photooriginal-2042618-UPQ6K.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'BC-ORIGIN 基礎款 浮力調整背心',
        description: 'Aropec 浮力調整背心',
        price: 11500,
        image: '/products/photooriginal-2042620-NJuVd.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'BC-COSMOS 浮力調整背心',
        description: 'Aropec 浮力調整背心',
        price: 12000,
        image: '/products/photooriginal-2042621-HFYYN.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: '手錶型 夾管型兩用指北針',
        description: 'Aropec 潛水儀表',
        price: 1250,
        image: '/products/photooriginal-2042622-rEtxb.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: '管夾式指北針',
        description: 'Aropec 潛水儀表',
        price: 1350,
        image: '/products/photooriginal-2042623-TUJDI.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: '手錶型腕帶式指北針',
        description: 'Aropec 潛水儀表',
        price: 1250,
        image: '/products/photooriginal-2042624-uCVhr.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: '平衡活塞式一級頭調節器組合',
        description: 'Aropec 調節器組合',
        price: 5500,
        image: '/products/photooriginal-2042656-q6KmF.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: '非平衡活塞式一級頭調節器組',
        description: 'Aropec 調節器組合',
        price: 5500,
        image: '/products/photooriginal-2042657-t3NJ4.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: '非平衡活塞式調節器組合',
        description: 'Aropec 調節器組合',
        price: 6500,
        image: '/products/photooriginal-2042658-jmNRb.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: '2mm 男款100%超彈性亮皮前拉鍊式防寒外套',
        description: 'Aropec 防寒衣',
        price: 3300,
        image: '/products/photooriginal-2042671-SPiK8.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: '2mm 女款100%超彈性亮皮前拉鍊式防寒外套',
        description: 'Aropec 防寒衣',
        price: 3300,
        image: '/products/photooriginal-2042672-DiQS3.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: '2mm 女款100%超彈性亮皮耐磨防寒長褲',
        description: 'Aropec 防寒衣',
        price: 3200,
        image: '/products/photooriginal-2042673-s8F85.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        name: '萊卡Lycra防曬潛水頭套',
        description: 'Aropec 防寒頭套',
        price: 800,
        image: '/products/photooriginal-2042828-RgQE7.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        name: '5/3mm超彈性頭套背心',
        description: 'Aropec 防寒背心',
        price: 2100,
        image: '/products/photooriginal-2042831-DPWQY.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        name: '2.5mm Warmbase拉鍊式頭套背心',
        description: 'Aropec 防寒背心',
        price: 2500,
        image: '/products/photooriginal-2042832-zZg4e.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        name: '2mm NeoSkin 100%全鈦金屬頭套背心',
        description: 'Aropec 防寒背心',
        price: 1680,
        image: '/products/photooriginal-2042833-TFI7R.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        name: '1.5mm Neoprene防風防寒保暖連帽外套',
        description: 'Aropec 防寒外套',
        price: 2680,
        image: '/products/photooriginal-2042835-y8eY8.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        name: '單面鏡 (亞洲臉型專用)',
        description: 'Aropec 面鏡',
        price: 1050,
        image: '/products/photooriginal-2042837-AzPYi.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 19,
        name: '大視野膠框單面鏡',
        description: 'Aropec 面鏡',
        price: 800,
        image: '/products/photooriginal-2042838-K9DHT.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        name: 'J型半乾式矽膠呼吸管',
        description: 'Aropec 呼吸管',
        price: 550,
        image: '/products/photooriginal-2042839-byaZw.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        name: 'C型半乾式矽膠呼吸管',
        description: 'Aropec 呼吸管',
        price: 550,
        image: '/products/photooriginal-2042840-7EBeW.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        name: 'C型簡易半乾式矽膠呼吸管',
        description: 'Aropec 呼吸管',
        price: 450,
        image: '/products/photooriginal-2042841-8GY5w.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 23,
        name: '2mm 超彈性Neoprene手套',
        description: 'Aropec 手套',
        price: 1100,
        image: '/products/photooriginal-2042861-5HGtC.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 24,
        name: '3mm Neoprene/Kevlar手套',
        description: 'Aropec 手套',
        price: 1100,
        image: '/products/photooriginal-2042862-IJkqu.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 25,
        name: '1.5mm 超彈性Neoprene手套',
        description: 'Aropec 手套',
        price: 990,
        image: '/products/photooriginal-2042863-EvmUs.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 26,
        name: '5mm Neoprene長筒毛氈底防滑鞋',
        description: 'Aropec 套鞋',
        price: 990,
        image: '/products/photooriginal-2042865-nZYnv.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 27,
        name: '3mm Neoprene短筒毛氈底防滑鞋',
        description: 'Aropec 套鞋',
        price: 800,
        image: '/products/photooriginal-2042866-hGHGy.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 28,
        name: '1.5mm Neoprene長筒毛氈底防滑鞋',
        description: 'Aropec 套鞋',
        price: 990,
        image: '/products/photooriginal-2042867-GhqBH.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 29,
        name: '自由潛水浮球-含內胎附潛水旗',
        description: 'Aropec 自潛浮球',
        price: 3000,
        image: '/products/photooriginal-2042868-jBPsq.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 30,
        name: '1.5mm Neoprene 長袖保暖萊克水母衣(女款)',
        description: 'Aropec 水母衣',
        price: 1500,
        image: '/products/photooriginal-2042870-572GC.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 31,
        name: '長袖萊克水母衣(女款)',
        description: 'Aropec 水母衣',
        price: 1290,
        image: '/products/photooriginal-2042871-gtKGu.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 32,
        name: '長袖萊克水母衣(男款)',
        description: 'Aropec 水母衣',
        price: 1090,
        image: '/products/photooriginal-2042890-2BHGb.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 33,
        name: '蛙鞋裝備袋',
        description: 'Aropec 裝備袋',
        price: 1350,
        image: '/products/photooriginal-2042887-WRczg.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 34,
        name: '手提式輕量型 網眼尼龍裝備袋',
        description: 'Aropec 裝備袋',
        price: 1200,
        image: '/products/photooriginal-2042888-ZCbNY.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 35,
        name: '旗艦型耐重拖輪裝備行李袋',
        description: 'Aropec 裝備袋',
        price: 6500,
        image: '/products/photooriginal-2042889-GmqTu.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 36,
        name: '自由套腳式長蛙鞋',
        description: 'Aropec 蛙鞋',
        price: 3200,
        image: '/products/photooriginal-2042900-uzhd3.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 37,
        name: '時尚速乾毛巾衣',
        description: 'Aropec 毛巾衣',
        price: 1350,
        image: '/products/photooriginal-2042893-99keL.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 38,
        name: '時尚速乾毛巾衣',
        description: 'Aropec 毛巾衣',
        price: 1350,
        image: '/products/photooriginal-2042895-ICaDu.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 39,
        name: '時尚速乾毛巾衣',
        description: 'Aropec 毛巾衣',
        price: 1350,
        image: '/products/photooriginal-2042896-8DVtt.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
