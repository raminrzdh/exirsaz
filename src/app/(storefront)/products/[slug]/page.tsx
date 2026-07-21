import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { toPersianDigits } from '@/lib/utils/currency';
import { ProductClientLayout } from '@/components/storefront/ProductClientLayout';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug: decodeURIComponent(slug) } });
  
  if (!product) {
    return { title: 'محصول یافت نشد | اکسیرساز' };
  }

  return {
    title: `${product.name} | فروشگاه اکسیرساز`,
    description: product.description || `خرید ${product.name} با بهترین قیمت از اکسیرساز شمال.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ 
    where: { slug: decodeURIComponent(slug) },
    include: { 
      category: true,
      variants: {
        include: {
          attributes: {
            include: {
              attributeValue: {
                include: { attribute: true }
              }
            }
          }
        }
      },
      comments: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Generate dynamic JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: (typeof product.images === 'string' ? JSON.parse(product.images) : product.images)?.[0] || 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'اکسیرساز شمال'
    },
    ...(product.salesType === 'DIRECT_SALE' ? {
      offers: product.variants && product.variants.length > 0 
        ? product.variants.map(v => ({
            '@type': 'Offer',
            url: `https://exirsaz.com/products/${product.slug}?variant=${v.id}`,
            priceCurrency: 'IRR',
            price: (v.price || 0) * 10,
            itemCondition: 'https://schema.org/NewCondition',
            availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          }))
        : product.price ? {
            '@type': 'Offer',
            url: `https://exirsaz.com/products/${product.slug}`,
            priceCurrency: 'IRR',
            price: product.price * 10,
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          } : {
            '@type': 'Offer',
            availability: 'https://schema.org/InStoreOnly',
          }
    } : {
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStoreOnly',
      }
    }),
    aggregateRating: product.comments.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.comments.reduce((acc, c) => acc + (c.rating || 5), 0) / product.comments.length,
      reviewCount: product.comments.length
    } : undefined,
    review: product.comments.length > 0 ? product.comments.map(c => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: c.rating || 5,
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: c.authorName,
      },
      datePublished: new Date(c.createdAt).toISOString(),
      reviewBody: c.content.replace(/<[^>]+>/g, ''),
    })) : undefined
  };

  // Process attributes and variants for Client Layout
  const attributesMap = new Map<string, Set<string>>();
  const clientVariants = product.variants.map(v => {
    const attrs: Record<string, string> = {};
    v.attributes.forEach(attrMapping => {
      const attrName = attrMapping.attributeValue.attribute.name;
      const attrValue = attrMapping.attributeValue.value;
      attrs[attrName] = attrValue;
      
      if (!attributesMap.has(attrName)) {
        attributesMap.set(attrName, new Set());
      }
      attributesMap.get(attrName)!.add(attrValue);
    });
    
    return {
      id: v.id,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      image: v.image,
      attributes: attrs
    };
  });

  const clientAttributes = Array.from(attributesMap.entries()).map(([name, valuesSet]) => ({
    name,
    values: Array.from(valuesSet)
  }));

  const productProp = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    price: product.price || undefined,
    salePrice: product.salePrice || undefined,
    stock: product.stock,
    salesType: product.salesType,
    inquiryAction: product.inquiryAction || undefined,
    salesTypeOverride: product.salesTypeOverride || undefined,
    categoryName: product.category?.name || undefined,
    image: (typeof product.images === 'string' ? JSON.parse(product.images) : product.images)?.[0] || 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
    rating: 5,
  };

  let parsedFeatures: { name: string, value: string }[] = [];
  try {
    if (product.features) {
      const parsed = JSON.parse(product.features);
      if (Array.isArray(parsed)) parsedFeatures = parsed;
    }
  } catch(e) {}

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductClientLayout 
        productProp={productProp as any} 
        attributes={clientAttributes} 
        variants={clientVariants} 
      />
      
      <article id="product-specifications" className="mt-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">مشخصات فنی و توضیحات تکمیلی</h2>
        
        {parsedFeatures.length > 0 && (
          <div className="mb-10">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-right">
                <tbody>
                  {parsedFeatures.map((f, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-4 font-bold text-slate-700 w-1/3 md:w-1/4 border-l border-slate-200">{f.name}</td>
                      <td className="p-4 text-slate-600 font-medium">{toPersianDigits(f.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {product.longContent ? (
          <div 
            className="prose prose-slate max-w-none leading-loose wp-content"
            dangerouslySetInnerHTML={{ __html: product.longContent }}
          />
        ) : (
          <div className="text-slate-600 leading-loose">
            <p>{product.description || 'توضیحات تکمیلی ثبت نشده است.'}</p>
          </div>
        )}
      </article>

      {/* Comments Section */}
      {product.comments.length > 0 && (
        <section id="product-reviews" className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <header className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">نظرات کاربران ({toPersianDigits(product.comments.length.toString())})</h2>
          </header>
          <div className="space-y-6">
            {product.comments.map(comment => (
              <article key={comment.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <header className="flex items-center justify-between mb-4">
                  <div className="font-bold text-slate-800">{comment.authorName}</div>
                  <time dateTime={new Date(comment.createdAt).toISOString()} className="text-sm text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                  </time>
                </header>
                <div 
                  className="text-slate-600 leading-relaxed text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
