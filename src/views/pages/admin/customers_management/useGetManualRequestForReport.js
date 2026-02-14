import { useEffect, useState } from "react";
import { customersManagementService } from "services/admin/customers_management.service";

const useGetManualRequestsForReport = ({
  page = 1,
  search = "",
  status = [],
  start_date = "",
  end_date = "",
  sort_field = "",
  sort_dir = "",
  account_number = "",
  detail_type = "",
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
    sort_dir = "",
    account_number = "",
    detail_type = ""
  ) => {
    try {
      const response = await customersManagementService.getCustomerWiseDetails({
        page,
        search,
        status,
        start_date,
        end_date,
        sort_field,
        sort_dir,
        account_number,
        detail_type,
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
      sort_dir,
      account_number,
      detail_type
    );
  }, [
    page,
    search?.trim(),
    status,
    start_date,
    end_date,
    sort_field,
    sort_dir,
    account_number,
    detail_type,
  ]);

  return [pagination, listRequests];
};

export default useGetManualRequestsForReport;
