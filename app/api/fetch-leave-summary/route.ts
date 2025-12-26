import Asana from 'asana'
import { NextResponse } from 'next/server'
import { getAsanaClient, mergeUsersWithData, transformAsanaData } from '@/app/utils'

export async function GET() {
  const accessToken = process.env.ASANA_ACCESS_TOKEN
  const projectGid = process.env.ASANA_PROJECT_GID

  if (!accessToken || !projectGid) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 })
  }

  try {
    const client = getAsanaClient()

    // because the runtime code (v1 style) doesn't match the v3 type definitions.
    const tasksApi = new (Asana as any).TasksApi(client)
    const usersApi = new (Asana as any).UsersApi(client)

    const [tasksResult, usersResult] = await Promise.all([
      tasksApi.getTasksForProject(projectGid, {
        limit: 100,
        opt_fields: 'custom_fields.name,custom_fields.display_value,custom_fields.enum_value',
      }),
      usersApi.getUsers({
        workspace: process.env.WORKSPACE_GID || '',
        opt_fields: 'email,name,photo.image_128x128',
      }),
    ])

    // Process the tasks into your chart structure
    const taskData = transformAsanaData(tasksResult.data)

    // Combine the processed chart data with the rich user info from the users API
    const finalData = await mergeUsersWithData(taskData, usersResult.data)

    return NextResponse.json({ success: true, data: finalData })
  } catch (error: any) {
    console.error('Asana API Error:', error.response?.body || error.message)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
