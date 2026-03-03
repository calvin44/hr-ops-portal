import Asana from 'asana'
import { NextResponse } from 'next/server'
import { getAsanaClient, mergeUsersWithData, transformAsanaData } from '@/app/utils'
import type { AsanaTask, AsanaUser } from '@/app/types'

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

    // Fetch tasks with pagination
    const allTasks: AsanaTask[] = []
    let tasksOffset: string | undefined
    do {
      const params: any = { limit: 100, opt_fields: 'custom_fields.name,custom_fields.display_value,custom_fields.enum_value' }
      if (tasksOffset) params.offset = tasksOffset
      const result = await tasksApi.getTasksForProject(projectGid, params)
      allTasks.push(...(result?.data ?? []))
      tasksOffset = result?._response?.next_page?.offset
    } while (tasksOffset)

    // Fetch users with pagination
    const allUsers: AsanaUser[] = []
    let usersOffset: string | undefined
    do {
      const params: any = { workspace: process.env.WORKSPACE_GID || '', opt_fields: 'email,name', limit: 100 }
      if (usersOffset) params.offset = usersOffset
      const result = await usersApi.getUsers(params)
      allUsers.push(...(result?.data ?? []))
      usersOffset = result?._response?.next_page?.offset
    } while (usersOffset)

    // Process the tasks into your chart structure
    const taskData = transformAsanaData(allTasks)

    // Combine the processed chart data with the rich user info from the users API
    const finalData = await mergeUsersWithData(taskData, allUsers)

    return NextResponse.json({ success: true, data: finalData })
  } catch (error: any) {
    console.error('Asana API Error:', error.response?.body || error.message)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
