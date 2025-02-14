import type { NextApiRequest, NextApiResponse } from 'next'

import {
  getCategoryBySlug,
  getCategorySlugs,
  getComponentsByCategory,
} from '@/services/api/components'

export default function handler(
  apiRequest: NextApiRequest,
  apiResponse: NextApiResponse
) {
  if (apiRequest.method !== 'GET') {
    return
  }

  const categorySlugs = getCategorySlugs()

  const componentsByCategory = categorySlugs.map(function (categorySlug) {
    const categoryDetail = getCategoryBySlug(`${categorySlug}`, [
      'title',
      'slug',
      'emoji',
    ])

    const categoryComponents = getComponentsByCategory(`${categorySlug}`, [
      'title',
      'category',
      'slug',
    ])

    return {
      categoryDetail,
      categoryComponents,
    }
  })

  const searchData = componentsByCategory.flatMap(function ({
    categoryDetail,
    categoryComponents,
  }) {
    return categoryComponents.map((componentData) => {
      const componentSlug = `${componentData.slug}`
      const categorySlug = `${categoryDetail.slug}`
      const trueSlug = componentSlug.replace(`${categorySlug}-`, '')

      return {
        slug: trueSlug,
        name: componentData.title,
        category: {
          slug: categoryDetail.slug,
          title: categoryDetail.title,
          emoji: categoryDetail.emoji,
        },
        id: componentSlug,
      }
    })
  })

  apiResponse.status(200).json(JSON.stringify(searchData, null, 2))
}
