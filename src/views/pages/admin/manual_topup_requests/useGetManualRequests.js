import { useEffect, useState } from "react";
import { fundRequestService } from "services/admin/fund_request.service";

const useGetManualRequests = ({
  page = 1,
  search = "",
  status = [],
  start_date = "",
  end_date = "",
  sort_field = "",
  sort_dir = "",
}) => {
  const [listRequests, setListRequests] = useState([]);
  const [pagination, setPagination] = useState({});

  const retrieveListActivities = async (
    page = 1,
    search = "",
    status = [],
    start_date = "",
    end_date = "",
    sort_field = "",
    sort_dir = ""
  ) => {
    try {
      const response = await fundRequestService.getManualFundAddList({
        page,
        search,
        status,
        start_date,
        end_date,
        sort_field,
        sort_dir,
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
    retrieveListActivities(
      page,
      search,
      status,
      start_date,
      end_date,
      sort_field,
      sort_dir
    );
  }, [
    page,
    search?.trim(),
    status,
    start_date,
    end_date,
    sort_field,
    sort_dir,
  ]);

  return [pagination, listRequests];
};

export default useGetManualRequests;
