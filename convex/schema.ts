import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  initialProjectGenerations: defineTable({
    userId: v.string(),
    projects: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        tags: v.array(v.string()),
      }),
    ),
  }),
})
