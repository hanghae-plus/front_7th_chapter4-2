import axios, { AxiosResponse } from "axios";

interface CacheItem<T> {
    data: Promise<AxiosResponse<T>>;
    timestamp: number;
    ttl: number;
}

class ApiClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cache = new Map<string, CacheItem<any>>();

    // 1. fetcher를 인자로 받지 않고, url을 받아 내부에서 처리하거나
    //    유연성을 위해 유지하되, key를 생략 가능하게 만들 수 있습니다.
    async get<T>(
        url: string,
        ttl: number = 5 * 60 * 1000,
        config = {} // axios config
    ): Promise<AxiosResponse<T>> {
        const now = Date.now();

        // URL 자체가 고유한 키가 됩니다.
        const cached = this.cache.get(url);

        // 2. 캐시 히트 (유효기간 체크)
        if (cached && now - cached.timestamp < cached.ttl) {
            console.log(`[Cache Hit] ${url}`); // 디버깅용
            return cached.data;
        }

        console.log(`[API Call] ${url}`); // 디버깅용

        // 3. 요청 생성 (Axios 호출을 내부에서 수행하여 사용성을 높임)
        const promise = axios.get<T>(url, config);

        // 4. 에러 발생 시 캐시에서 즉시 제거 (실패한 요청을 캐싱하지 않기 위함)
        promise.catch(() => {
            this.cache.delete(url);
        });

        // 5. 캐시 저장
        this.cache.set(url, {
            data: promise,
            timestamp: now,
            ttl,
        });

        return promise;
    }

    // (선택) 특정 캐시를 강제로 지워야 할 때 (예: 새로고침 버튼)
    clearCache(url: string) {
        this.cache.delete(url);
    }
}

// 중요: 클래스 자체가 아니라 '인스턴스'를 export 해야 앱 전역에서 캐시가 공유됩니다.
export const apiClient = new ApiClient();