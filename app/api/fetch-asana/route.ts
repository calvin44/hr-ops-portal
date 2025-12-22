import Asana from 'asana'
import { NextResponse } from 'next/server'
import { transformAsanaData } from '@/app/utils/transformData'

export async function GET() {
  const accessToken = process.env.ASANA_ACCESS_TOKEN
  const projectGid = process.env.ASANA_PROJECT_GID

  if (!accessToken || !projectGid) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 })
  }

  try {
    // 1. Initialize Client
    // because the runtime code (v1 style) doesn't match the v3 type definitions.
    let client = new (Asana as any).ApiClient()
    client.authentications.token.accessToken = accessToken

    const opts = {
      limit: 100,
      opt_fields: [
        'custom_fields.name',
        'custom_fields.display_value',
        'custom_fields.text_value',
        'custom_fields.enum_value',
      ].join(','),
    }

    // 2. Fetch Tasks
    // because the runtime code (v1 style) doesn't match the v3 type definitions.
    const tasksApi = new (Asana as any).TasksApi(client)
    const result = await tasksApi.getTasksForProject(projectGid, opts)

    // 3. Transform
    const cleanData = transformAsanaData(result.data)

    return NextResponse.json({ success: true, data: cleanData })
  } catch (error: any) {
    console.error('Asana Error:', error.value || error.message)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}
