/**
 * 轻量请求抽象层（当前为 Mock/模拟接口场景服务）
 * - 用了什么：Promise 超时控制、重试机制、自定义错误类型 RequestError。
 * - 为什么用：即便是 Mock 数据也保持和真实请求一致的错误处理模型，方便后续平滑替换真实 HTTP 客户端。
 * - 怎么调用：`request(() => somePromise(), { timeoutMs, retries })`，返回强类型 Promise。
 */
export class RequestError extends Error {
  code: string
  status?: number

  constructor(message: string, code = 'REQUEST_ERROR', status?: number) {
    super(message)
    this.name = 'RequestError'
    this.code = code
    this.status = status
  }
}

interface RequestOptions {
  timeoutMs?: number
  retries?: number
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new RequestError('请求超时，请稍后重试', 'TIMEOUT'))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

/**
 * 统一请求入口：
 * - 标准化错误对象
 * - 简单超时控制
 * - 可配置重试
 */
export async function request<T>(
  executor: () => Promise<T>,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 4000, retries = 0 } = options

  let lastError: unknown
  for (let i = 0; i <= retries; i++) {
    try {
      return await withTimeout(executor(), timeoutMs)
    } catch (error) {
      lastError = error
      if (i < retries) {
        await sleep(200 * (i + 1))
      }
    }
  }

  if (lastError instanceof RequestError) throw lastError
  throw new RequestError('请求失败，请稍后重试')
}

