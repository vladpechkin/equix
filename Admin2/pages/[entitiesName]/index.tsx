import { useRouter } from "next/router";
import { Layout } from "../../equix/Layout";
import { EntitiesEditor } from "../../equix/components/EntitiesEditor";

const Page = () => {
  const router = useRouter();
  const { entitiesName } = router.query;
  return (
    entitiesName &&
    router.asPath && (
      <Layout className="p-4">
        <EntitiesEditor
          entitiesName={entitiesName as string}
          entitiesEndpoint={
            `${router.asPath.slice(1)}`
          }
        />
      </Layout>
    )
  );
};

export default Page;
