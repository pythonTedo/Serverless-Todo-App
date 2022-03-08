import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodoItem } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')
// DONE: Update a TODO item with the provided id using values in the "updatedTodo" object
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    await updateTodoItem(todoId, updatedTodo, userId);

    return {
      statusCode: 204,
      body: ''
    };
  });

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
