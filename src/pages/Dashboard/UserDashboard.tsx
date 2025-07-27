import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import SalesUserComp from "../SalesUserComp";
import WelcomeModal from "../../components/WelcomeModal"; // adjust path if needed
import SalesLead from "../SalesLead";
import SalesRankingTable from "../../components/SalesRankingTable";

export default function Home() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state?.showWelcomeModal) {
      setShowModal(true);
    }
  }, [location.state]);

  return (
    <>
      <PageMeta
        title="motor Dashboard"
        description="This is a Geneys Industries Dashboard"
      />
      {/* {showModal && <WelcomeModal onClose={() => setShowModal(false)} />} */}

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
         
          <StatisticsChart />
          <SalesUserComp />
        </div> */}
        <div className="col-span-12 xl:col-span-5">
        <EcommerceMetrics />
           {/* <SalesRankingTable /> */}
        </div>
        <div className="col-span-12"></div>
      </div>
    </>
  );
}
