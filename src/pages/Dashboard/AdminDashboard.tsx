import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import SalesRankingTable from "../../components/SalesRankingTable";
import BookedRankingTable from "../../components/BookedRankingTable";
import ShippedRankingTable from "../../components/ShippedRankingTable";

export default function Home() {
    return (
        <>
            <PageMeta
                title="Genesys Industries Dashboard"
                description="This is a Genesys Industries Dashboard"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-2 xl:col-span-6">
                    <StatisticsChart />
                    <BookedRankingTable />
                    
                    <ShippedRankingTable />
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <EcommerceMetrics />
                    <div className="my-2">
                    <SalesRankingTable />
                    </div>
                </div>
            </div>
        </>
    );
}
