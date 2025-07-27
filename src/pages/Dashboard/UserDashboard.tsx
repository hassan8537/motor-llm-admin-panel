import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta title="Dashboard" description="This is a Atlas AI Dashboard" />
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
