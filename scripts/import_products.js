const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const csvData = `
Id,Sku,Product name,Manage stock,Stock status,Backorders,Stock,Type,Parent ID
1961,,حصاری شبکه ساده آبی 600×1 متر,,outofstock,no,,simple,
1962,,حصاری شبکه ساده زرد 600×1 متر,,outofstock,no,,simple,
2041,,حصاری شبکه ساده سبز 600×1 متر,,outofstock,no,,simple,
2042,,حصاری شبکه ساده پرتقالی 600×1 متر,,outofstock,no,,simple,
2043,,حصاری شبکه ساده سبز 600×1.2 متر,,outofstock,no,,simple,
2044,,حصاری شبکه ساده آبی 600×1.2 متر,,outofstock,no,,simple,
2045,,حصاری شبکه ساده زرد 600×1.2 متر,,outofstock,no,,simple,
2046,,حصاری شبکه ساده پرتقالی 600×1.2 متر,,outofstock,no,,simple,
2047,,حصاری شبکه ساده سبز 600×1.45 متر,,outofstock,no,,simple,
2048,,حصاری شبکه ساده آبی 600×1.45 متر,,outofstock,no,,simple,
2049,,حصاری شبکه ساده زرد 600×1.45 متر,,outofstock,no,,simple,
2050,,حصاری شبکه ساده پرتقالی 600×1.45 متر,,outofstock,no,,simple,
2051,,شبكه سايبان UV دار سبز تيره 50×2 متر 30%,,outofstock,no,,simple,
2052,,شبكه سايبان UV دار سبز تيره 50×3 متر 30%,,outofstock,no,,simple,
2053,,شبكه سايبان UV دار سبز تيره 50×4 متر 30%,,outofstock,no,,simple,
2054,,شبكه سايبان UV دار سبز تيره 50×6 متر 30%,,outofstock,no,,simple,
2055,,شبكه سايبان UV دار سبز تيره 50×8 متر 30%,,outofstock,no,,simple,
2056,,شبكه سايبان UV دار سبز تيره 50×10 متر 30%,,outofstock,no,,simple,
2057,,شبکه سایبان Uv دار سبز تیره 50×12 متر 30% | توقف تولید,,outofstock,no,,simple,
2058,,شبکه سایبان Uv دار سبز تیره 50×2 متر 50%,,outofstock,no,,simple,
2059,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×3 متر 50%,,outofstock,no,,simple,
2060,,شبکه سایبان Uv دار سبز تیره 50×4 متر 50% | توقف تولید,,outofstock,no,,simple,
2061,,شبکه سایبان Uv دار سبز تیره 50×6 متر 50% | توقف تولید,,outofstock,no,,simple,
2062,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×8 متر 50%,,outofstock,no,,simple,
2063,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×10 متر 50%,,outofstock,no,,simple,
2064,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×12 متر 50%,,outofstock,no,,simple,
2075,,شبکه سایبان Uv دار سبز تیره 50×10 متر 65% | توقف تولید,,outofstock,no,,simple,
2077,,شبكه سايبان UV دار سبز تيره 50×2 متر 80%,true,instock,no,3,simple,
2079,,شبکه سایبان Uv دار سبز تیره 50×3 متر 80%,true,instock,no,3,simple,
2080,,شبكه سايبان UV دار سبز تيره 50×4 متر 80%,true,instock,no,3,simple,
2081,,شبكه سايبان UV دار سبز تيره 50×6 متر 80%,true,instock,no,3,simple,
2082,,شبكه سايبان UV دار سبز تيره 50×8 متر 80%,true,instock,no,3,simple,
2083,,شبكه سايبان UV دار سبز تيره 50×10 متر 80%,true,instock,no,3,simple,
2084,,شبکه سایبان Uv دار سبز تیره 50×12 متر 80%,,outofstock,no,,simple,
2085,,کیسه پرتقالی 50×37,,outofstock,no,,simple,
2086,,کیسه زرد 80×50,,outofstock,no,,simple,
2087,,کیسه قرمز 80×50,,outofstock,no,,simple,
2088,,كليپس نصب كوچك,true,instock,no,8600,simple,
2089,,كليپس نصب بزرگ,true,instock,no,9250,simple,
2833,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×6 متر 50%,,outofstock,no,,simple,
2906,,كيسه خرما سبز روشن 90×80 /بافت درشت,,outofstock,no,,simple,
2922,,شبکه سایبان Uv دار سبز تیره 50×2 متر 70% | توقف تولید,,outofstock,no,,simple,
2925,,شبکه سایبان Uv دار سبز تیره 50×4 متر70% | توقف تولید,,outofstock,no,,simple,
2926,,شبکه سایبان Uv دار سبز تیره 50×6 متر 70% | توقف تولید,,outofstock,no,,simple,
4360,,شبکه سایبان مونوتیپ Uv دار سبز تیره 50×8 متر 50%,,outofstock,no,,simple,
4362,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×4 متر 50%,,outofstock,no,,simple,
4364,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×2 متر 50%,,outofstock,no,,simple,
5326,,شبکه سایبان Uv دار سبز تیره 50×8 متر 90% | توقف تولید,,outofstock,no,,simple,
5330,,شبکه سایبان Uv دار سبز تیره 50×6 متر 90% | توقف تولید,,outofstock,no,,simple,
5331,,شبکه سایبان Uv دار سبز تیره 50×4 متر 90% | توقف تولید,,outofstock,no,,simple,
5332,,شبکه سایبان Uv دار سبز تیره 50×2 متر 90% | توقف تولید,,outofstock,no,,simple,
6006,,شبكه سايبان UV دار سبز تيره 50×3 متر 80%,,outofstock,no,,simple,
6816,,شبكه سايبان UV دار سبز تيره 4×4 متر 80% /ساك /پانچ شده,,outofstock,no,,simple,
6821,,شبكه سايبان UV دار سبز تيره 5×4 متر 80% /ساك /پانچ شده,,outofstock,no,,simple,
6822,,شبكه سايبان UV دار سبز تيره 6×4 متر 80% /ساك /پانچ شده,,outofstock,no,,simple,
7265,,شبکه سایبان Uv دار مونوتیپ مشکی و سبز تیره 50×2 متر 90% 150GSM,,outofstock,no,,simple,
7309,,کیسه خرما جدید,,outofstock,no,,simple,
8041,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×2 متر 90% / 130GSM,true,instock,no,2,simple,
8048,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×4 متر 90% / 130GSM,true,instock,no,3,simple,
8049,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×6 متر 90% / 130GSM,true,instock,no,3,simple,
8050,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×8 متر 90% / 130GSM,true,instock,no,3,simple,
8051,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×10 متر 90% / 130GSM,,outofstock,no,,simple,
8052,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×2 متر 90% / 150GSM,true,instock,no,3,simple,
8054,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×4 متر 90% / 150GSM,true,instock,no,3,simple,
8055,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×6 متر 90% / 150GSM,true,instock,no,3,simple,
8056,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×8 متر 90% / 150GSM,true,instock,no,3,simple,
8057,,شبكه سايبان UV دار مونوتيپ مشكي و بژ 50×2 متر 90% / 150GSM,,outofstock,no,,simple,
8058,,شبكه سايبان UV دار مونوتيپ مشكي و بژ 50×4 متر 90% / 150GSM,,outofstock,no,,simple,
8059,,شبكه سايبان UV دار مونوتيپ مشكي و بژ 50×6 متر 90% / 150GSM,,outofstock,no,,simple,
8060,,شبكه سايبان UV دار مونوتيپ مشكي و بژ 50×8 متر 90% / 150GSM,,outofstock,no,,simple,
8062,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 4×4 متر 90% / 150GSM /ساك /پانچ شده,,outofstock,no,,simple,
8063,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 5×4 متر 90% / 150GSM /ساك /پانچ شده,,outofstock,no,,simple,
8064,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×2 متر 95%,,outofstock,no,,simple,
8065,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×4 متر 95%,,outofstock,no,,simple,
8066,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×6 متر 95%,,outofstock,no,,simple,
8067,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 50×8 متر 95%,,outofstock,no,,simple,
8068,,شبكه سايبان UV دار سبز تيره 50×5 متر 80%,true,instock,no,3,simple,
8097,,شبكه سايبان UV دار مونوتيپ مشكي و سبز تيره 6×4 متر 90% / 150GSM /ساك /پانچ شده,,outofstock,no,,simple,
9485,,توری سایبان UVدار سبز 80 درصد 7×4 متر,,outofstock,no,,simple,
9486,,توری سایبان UVدار سبز 95 درصد 8×6 متر,,outofstock,no,,simple,
9488,,توری سایبان UVدار مشکی بژ 90 درصد 2×4 متر,,outofstock,no,,simple,
9491,,توری سایبان UVدار سبز 80 درصد حلقه دار 4×3 متر,,outofstock,no,,simple,
9506,,توری سایبان UVدار سفید 80 درصد 5×8 متر,,outofstock,no,,simple,
9541,,توری سایبان UVدار سبز تیره 80 درصد 5×4 متر,,outofstock,no,,simple,
9544,,توری سایبان UVدار سبز 80 درصد 4×1 متر,,outofstock,no,,simple,
9547,,توری سایبان UVدار سبز 80 درصد 7×4 متر,,outofstock,no,,simple,
9550,,توری سایبان UVدار سبز 90 درصد 6×1 متر,,outofstock,no,,simple,
9553,,توری سایبان UVدار 90 درصد 5×4 متر,,outofstock,no,,simple,
9558,,توری سایبان UVدار سبز تیره 80 درصد 5×4 متر,,outofstock,no,,simple,
9640,,توری سایبان UVدار سبز تیره 80 درصد 5×1 متر,true,instock,no,1,simple,
9641,,توری سایبان UVدار سبز تیره 80 درصد 7×2 متر,true,instock,no,1,simple,
9642,,توری سایبان UVدار سبز تیره 80 درصد 10×3 متر,true,instock,no,1,simple,
9643,,توری سایبان UVدار سبز تیره 80 درصد 6×2 متر,true,instock,no,1,simple,
9644,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 12×4 متر 130GSM,true,instock,no,1,simple,
9645,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 13×4 متر 130GSM,true,instock,no,1,simple,
9646,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 18×4 متر 130GSM,true,instock,no,1,simple,
9647,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 15×3 متر 130GSM,true,instock,no,1,simple,
9648,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 10×4 متر 130GSM,true,instock,no,2,simple,
9649,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 8×4 متر 130GSM,true,instock,no,1,simple,
9651,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 16×3 متر 130GSM,true,instock,no,1,simple,
9652,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 15×4 متر 130GSM,true,instock,no,2,simple,
9653,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 20×4 متر 150GSM,true,instock,no,1,simple,
9654,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 18×6 متر 150GSM,true,instock,no,1,simple,
9655,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 18×2 متر 150GSM,true,instock,no,1,simple,
9656,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 17×2 متر 150GSM,true,instock,no,1,simple,
9657,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 14×6 متر 150GSM,true,instock,no,1,simple,
9659,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 19×6 متر 150GSM,true,instock,no,1,simple,
9660,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 17×2 متر 150GSM,true,instock,no,1,simple,
9662,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 8×3 متر 130GSM,true,instock,no,1,simple,
9664,,توری سایبان UVدار سبز تیره 80 درصد 6×4 متر,true,instock,no,1,simple,
9666,,توری سایبان UVدار سبز تیره 80 درصد 8×2 متر,true,instock,no,1,simple,
9667,,توری سایبان UVدار سبز تیره 80 درصد 9×2 متر,true,instock,no,2,simple,
9669,,توری سایبان UVدار سبز تیره 80 درصد 9×4 متر,true,instock,no,1,simple,
9671,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 15×6 متر 150GSM,true,instock,no,1,simple,
9672,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 11×6 متر 150GSM,true,instock,no,1,simple,
9673,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 16×6 متر 150GSM,true,instock,no,1,simple,
9674,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 10×4 متر 150GSM,true,instock,no,1,simple,
9676,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 11×2 متر 150GSM,true,instock,no,1,simple,
9678,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 12×2 متر 150GS,true,instock,no,1,simple,
9679,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 15×8 متر 150GSM,true,instock,no,1,simple,
9680,,توری سایبان UVدار مشکی و سبز تیره مونوتیپ 90 درصد 15×2 متر 150GSM,true,instock,no,1,simple,
9682,,توری سایبان UVدار سفید مونوتیپ 90 درصد 16×3 متر 130GSM,true,instock,no,1,simple,
9683,,توری سایبان UVدار سفید 80 درصد 11×8 متر,true,instock,no,1,simple,
9684,,توری سایبان UVدار سبز تیره 80 درصد 19×6 متر,true,instock,no,1,simple,
9685,,توری سایبان UVدار سبز تیره 80 درصد 18×6 متر,true,instock,no,1,simple,
9687,,توری سایبان UVدار سبز تیره 80 درصد 17×5 متر,true,instock,no,1,simple,
9688,,توری سایبان UVدار سبز تیره 80 درصد 15×3 متر,true,instock,no,1,simple,
9689,,توری سایبان UVدار سبز تیره 80 درصد 18×2 متر,true,instock,no,1,simple,
9690,,توری سایبان UVدار سبز تیره 80 درصد 12×3 متر,true,instock,no,2,simple,
9691,,توری سایبان UVدار سبز تیره 80 درصد 14×3 متر,true,instock,no,1,simple,
9692,,توری سایبان UVدار سبز تیره 80 درصد 20×2 متر,true,instock,no,1,simple,
9693,,توری سایبان UVدار توسی 80 درصد 20×4 متر,true,instock,no,1,simple,
9694,,توری سایبان UVدار بژ 80 درصد 7×6 متر,true,instock,no,2,simple,
9696,,توری سایبان UVدار بژ 80 درصد 9×6 متر,true,instock,no,1,simple,
9699,,توری سایبان UVدار بژ 80 درصد 15×6 متر,true,instock,no,1,simple,
9700,,توری سایبان UVدار بژ 80 درصد 14×6 متر,true,instock,no,1,simple,
9701,,توری سایبان UVدار توسی 80 درصد 20×2 متر,true,instock,no,1,simple,
9702,,توری سایبان UVدار توسی 80 درصد 17×4 متر,true,instock,no,1,simple,
9703,,توری سایبان UVدار توسی 80 درصد 15×4 متر,true,instock,no,1,simple,
9704,,توری سایبان UVدار توسی 80 درصد 16×4 متر,true,instock,no,1,simple,
9705,,توری سایبان UVدار توسی 80 درصد 10×4 متر,true,instock,no,1,simple,
9706,,توری سایبان UVدار بژ 80 درصد 18×6 متر,true,instock,no,1,simple,
9707,,توری سایبان UVدار توسی 80 درصد 8×4 متر,true,instock,no,1,simple,
9708,,توری سایبان UVدار توسی 80 درصد 10×2 متر,true,instock,no,3,simple,
9709,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 7×4 متر 130GSM,true,instock,no,1,simple,
9710,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 6×5 متر 130GSM,true,instock,no,1,simple,
9711,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 19×6 متر 130GSM,true,instock,no,1,simple,
9712,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 7×6 متر 130GSM,true,instock,no,1,simple,
9713,,توری سایبان UVدار مشکی و بژ مونوتیپ 90 درصد 10×4 متر 130GSM,true,instock,no,2,simple,
9800,,توری سایبان UVدار سفید مونوتیپ 90 درصد 19×3 متر 130GSM,true,instock,no,1,simple
`;

function getCategoryData(name) {
  if (name.includes('مونوتیپ')) return { name: 'توری سایبان مونوتیپ', slug: 'توری-سایبان-مونوتیپ' };
  if (name.includes('سایبان')) return { name: 'توری سایبان', slug: 'توری-سایبان' };
  if (name.includes('حصاری')) return { name: 'توری حصاری', slug: 'توری-حصاری' };
  if (name.includes('خرما')) return { name: 'کیسه پوشش خرما', slug: 'کیسه-پوشش-خرما' };
  if (name.includes('کیسه')) return { name: 'کیسه راشل', slug: 'کیسه-راشل' };
  if (name.includes('کلیپس')) return { name: 'لوازم جانبی', slug: 'لوازم-جانبی' };
  return { name: 'سایر محصولات', slug: 'other-products' };
}

function generateSlug(name) {
  return name.replace(/\s+/g, '-').replace(/[^\w\s-آ-ی]/gi, '') + '-' + Math.floor(Math.random() * 10000);
}

async function run() {
  const lines = csvData.trim().split('\n').slice(1);
  const categoriesMap = {};

  for (const line of lines) {
    const cols = line.split(',');
    const name = cols[2];
    const stockStatus = cols[4];
    const stockQuantityStr = cols[6];
    
    if (!name) continue;

    const catData = getCategoryData(name);
    
    let categoryId = categoriesMap[catData.slug];
    if (!categoryId) {
      let dbCat = await prisma.category.findUnique({ where: { slug: catData.slug } });
      if (!dbCat) {
        dbCat = await prisma.category.create({
          data: { name: catData.name, slug: catData.slug }
        });
      }
      categoriesMap[catData.slug] = dbCat.id;
      categoryId = dbCat.id;
    }

    const price = Math.floor(Math.random() * 45 + 5) * 100000; // 500k to 5M

    let stock = 0;
    let salesType = 'INQUIRY';
    let inquiryAction = 'CALL_TO_PRICE';
    
    if (stockStatus === 'instock') {
      stock = parseInt(stockQuantityStr) || Math.floor(Math.random() * 50) + 10;
      salesType = 'DIRECT_SALE';
      inquiryAction = null;
    }

    // Determine representative image based on category
    let images = '["https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg"]';
    if (catData.name === 'کیسه راشل') images = '["https://exirsaz.com/wp-content/uploads/2023/04/raschel-bag.jpg"]';
    if (catData.name === 'تجهیزات نصب') images = '["https://exirsaz.com/wp-content/uploads/2023/04/clips.jpg"]';
    if (catData.name === 'توری حصاری') images = '["https://exirsaz.com/wp-content/uploads/2023/04/fence.jpg"]';

    await prisma.product.create({
      data: {
        name,
        slug: generateSlug(name),
        price,
        stock,
        salesType,
        inquiryAction,
        categoryId,
        images,
        description: 'توضیحات پیش‌فرض برای ' + name
      }
    });
    
    console.log('Added:', name);
  }
  
  console.log('Done importing products!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
