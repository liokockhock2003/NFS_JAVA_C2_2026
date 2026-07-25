import { useEffect, useState } from 'react';
import ApiInfoCard from '../components/ApiInfoCard.jsx';
import { fetchApiInfo } from '../services/api.js';

export default function DashboardPage() {
  const [apiInfo, setApiInfo] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadApiInformation() {
      try {
        setLoadingApi(true);
        setApiError('');

        const info = await fetchApiInfo();

        if (!ignore) {
          setApiInfo(info);
        }
      } catch (error) {
        if (!ignore) {
          setApiError(
            'Could not connect to backend. Start Spring Boot on port 8080 and try again.'
          );
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setLoadingApi(false);
        }
      }
    }

    loadApiInformation();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <h2>Dashboard</h2>
      <ApiInfoCard loading={loadingApi} error={apiError} apiInfo={apiInfo} />
    </>
  );
}
