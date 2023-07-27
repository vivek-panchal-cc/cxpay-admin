import { useEffect, useState } from "react";
import { fundRequestService } from "services/admin/fund_request.service";

const useGetManualRequests = ({
  page = 1,
  search = "",
  status = [],
  start_date = "",
  end_date = "",
}) => {
  const [listRequests, setListRequests] = useState([]);
  const [pagination, setPagination] = useState({});

  const retrieveListActivities = async (
    page = 1,
    search = "",
    status = [],
    start_date = "",
    end_date = ""
  ) => {
    try {
      const response = await fundRequestService.getManualFundAddList({
        page,
        search,
        status,
        start_date,
        end_date,
      });
      const { success, data, message = "" } = response || {};
      if (!success) throw message;
      const { manual_funds = [], pagination = {} } = data || {};
      setListRequests(manual_funds);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      setListRequests([]);
      setPagination({});
    }
  };

  useEffect(() => {
    retrieveListActivities(page, search, status, start_date, end_date);
  }, [page, search?.trim(), status, start_date, end_date]);

  return [pagination, listRequests];
};

export default useGetManualRequests;
