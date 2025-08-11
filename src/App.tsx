import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Kasane } from "kasane-client";

function App() {
  const [count, setCount] = useState(0);
  const [kasane, setKasane] = useState<Kasane | null>(null);
  const [temperatureValue, setTemperatureValue] = useState<number | null>(null);

  // Kasaneの初期化
  useEffect(() => {
    async function initKasane() {
      const instance = await Kasane.init(
        "http://cdn.kasane.dev/kasane_bg.wasm"
      );

      instance.addSpace({ space: "sensor_data" });
      instance.addKey({
        space: "sensor_data",
        key: "temperature",
        type: "INT",
      });
      instance.addKey({
        space: "sensor_data",
        key: "location_name",
        type: "TEXT",
      });

      setKasane(instance);
    }
    initKasane();
  }, []);

  // kasaneがセットされたら一度だけ値をセットして取得
  useEffect(() => {
    if (!kasane) return;

    kasane.setValue({
      space: "sensor_data",
      key: "temperature",
      range: {
        OR: [{ z: 5, f: [3, 5], x: [3], y: [3], i: 0, t: ["-"] }],
      },
      value: 30,
    });

    const neko = kasane.getValue({
      space: "sensor_data",
      key: "temperature",
      range: {
        OR: [{ z: 5, f: [3, 5], x: [3, "-"], y: [3], i: 0, t: ["-"] }],
      },
      options: { vertex: true, id_pure: true },
    });

    // nekoの型がわからないですが、値を取り出してセット
    if (Array.isArray(neko) && neko.length > 0) {
      // 例: nekoの最初のvalueをstateにセット
      setTemperatureValue(Number(neko[0].value));
    } else {
      setTemperatureValue(null);
    }
  }, [kasane]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>kasane-react-example</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        {kasane ? kasane.getVersion() : "Loading..."}
      </p>

      {/* temperatureValueを画面に表示 */}
      <p>Temperature Value from Kasane: {temperatureValue ?? "No data"}</p>
    </>
  );
}

export default App;
