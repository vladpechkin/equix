import { useRouter } from "next/router";
import { Layout } from "../../equix/Layout";
import { EntityEditor } from "../../equix/components/EntityEditor";

const Page = () => {
  const router = useRouter();
  const { entitiesName, entityId } = router.query;
  return (
    entitiesName &&
    entityId && (
      <Layout className="p-4">
        <EntityEditor
          entitiesName={entitiesName as string}
          entityId={entityId as string}
        />
      </Layout>
    )
  );
};

export default Page;
