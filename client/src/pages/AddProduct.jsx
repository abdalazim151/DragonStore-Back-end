import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import "./AddProduct.css";

export default function AddProduct() {
  const [type, setType] = useState("Laptop");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [common, setCommon] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [laptop, setLaptop] = useState({
    brand: "",
    processor: "",
    ram: "16",
    storageSize: "512",
    storageType: "SSD",
    gpu: "",
    screenSize: "15",
    os: "Windows 11",
  });

  const [mobile, setMobile] = useState({
    brand: "",
    modelName: "",
    storage: "128GB",
    ram: "8GB",
    screenSize: "6.1",
    battery: "",
    processor: "",
    camera: "",
    is5G: false,
  });

  const [hp, setHp] = useState({
    brand: "",
    hpType: "Over-Ear",
    connectionType: "Wireless",
    batteryLife: "",
    hasNoiseCancelling: false,
    microphone: true,
  });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const file = e.target.img?.files?.[0];
    if (!file) {
      setError("Please choose a product image.");
      return;
    }

    const fd = new FormData();
    fd.append("img", file);
    fd.append("Type", type);
    fd.append("title", common.title);
    fd.append("price", String(common.price));
    fd.append("description", common.description || "");

    if (type === "Laptop") {
      fd.append("brand", laptop.brand);
      fd.append("processor", laptop.processor);
      fd.append("ram", Number(laptop.ram));
      fd.append(
        "storage",
        JSON.stringify({
          size: Number(laptop.storageSize),
          type: laptop.storageType,
        })
      );
      if (laptop.gpu) fd.append("gpu", laptop.gpu);
      fd.append("screenSize", Number(laptop.screenSize));
      fd.append("os", laptop.os);
    } else if (type === "mobiles") {
      fd.append("brand", mobile.brand);
      fd.append("modelName", mobile.modelName);
      fd.append(
        "specifications",
        JSON.stringify({
          storage: mobile.storage,
          ram: mobile.ram,
          screenSize: mobile.screenSize,
          battery: mobile.battery,
          processor: mobile.processor,
          camera: mobile.camera,
        })
      );
      fd.append("is5G", mobile.is5G ? "true" : "false");
    } else {
      fd.append("brand", hp.brand);
      fd.append("type", hp.hpType);
      fd.append("connectionType", hp.connectionType);
      if (hp.batteryLife) fd.append("batteryLife", hp.batteryLife);
      fd.append("hasNoiseCancelling", hp.hasNoiseCancelling ? "true" : "false");
      fd.append("microphone", hp.microphone ? "true" : "false");
    }

    setLoading(true);
    try {
      await apiFetch("/api/products", { method: "POST", body: fd });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-product">
      <h1>Add product</h1>
      <form onSubmit={onSubmit} className="card add-form">
        <label>
          Category
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Laptop">Laptop</option>
            <option value="mobiles">Mobile</option>
            <option value="headphone">Headphone</option>
          </select>
        </label>

        <div className="form-row-3">
          <label>
            Title
            <input
              required
              value={common.title}
              onChange={(e) =>
                setCommon({ ...common, title: e.target.value })
              }
            />
          </label>
          <label>
            Price
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={common.price}
              onChange={(e) =>
                setCommon({ ...common, price: e.target.value })
              }
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            rows={3}
            value={common.description}
            onChange={(e) =>
              setCommon({ ...common, description: e.target.value })
            }
          />
        </label>

        {type === "Laptop" && (
          <section className="fieldset">
            <h3>Laptop details</h3>
            <div className="form-row-3">
              <label>
                Brand
                <input
                  required
                  value={laptop.brand}
                  onChange={(e) =>
                    setLaptop({ ...laptop, brand: e.target.value })
                  }
                />
              </label>
              <label>
                Processor
                <input
                  required
                  value={laptop.processor}
                  onChange={(e) =>
                    setLaptop({ ...laptop, processor: e.target.value })
                  }
                />
              </label>
              <label>
                RAM (GB)
                <select
                  value={laptop.ram}
                  onChange={(e) =>
                    setLaptop({ ...laptop, ram: e.target.value })
                  }
                >
                  {[8, 16, 32, 64].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row-3">
              <label>
                Storage size (GB)
                <input
                  type="number"
                  required
                  value={laptop.storageSize}
                  onChange={(e) =>
                    setLaptop({ ...laptop, storageSize: e.target.value })
                  }
                />
              </label>
              <label>
                Storage type
                <select
                  value={laptop.storageType}
                  onChange={(e) =>
                    setLaptop({ ...laptop, storageType: e.target.value })
                  }
                >
                  <option value="SSD">SSD</option>
                  <option value="HDD">HDD</option>
                </select>
              </label>
              <label>
                Screen (inches)
                <input
                  type="number"
                  step="0.1"
                  value={laptop.screenSize}
                  onChange={(e) =>
                    setLaptop({ ...laptop, screenSize: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              GPU (optional)
              <input
                value={laptop.gpu}
                onChange={(e) => setLaptop({ ...laptop, gpu: e.target.value })}
              />
            </label>
            <label>
              OS
              <input
                value={laptop.os}
                onChange={(e) => setLaptop({ ...laptop, os: e.target.value })}
              />
            </label>
          </section>
        )}

        {type === "mobiles" && (
          <section className="fieldset">
            <h3>Mobile details</h3>
            <div className="form-row-3">
              <label>
                Brand
                <input
                  required
                  value={mobile.brand}
                  onChange={(e) =>
                    setMobile({ ...mobile, brand: e.target.value })
                  }
                />
              </label>
              <label>
                Model
                <input
                  required
                  value={mobile.modelName}
                  onChange={(e) =>
                    setMobile({ ...mobile, modelName: e.target.value })
                  }
                />
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={mobile.is5G}
                  onChange={(e) =>
                    setMobile({ ...mobile, is5G: e.target.checked })
                  }
                />
                5G
              </label>
            </div>
            <div className="form-row-3">
              <label>
                Storage
                <select
                  value={mobile.storage}
                  onChange={(e) =>
                    setMobile({ ...mobile, storage: e.target.value })
                  }
                >
                  {["64GB", "128GB", "256GB", "512GB", "1TB"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                RAM
                <select
                  value={mobile.ram}
                  onChange={(e) =>
                    setMobile({ ...mobile, ram: e.target.value })
                  }
                >
                  {["4GB", "6GB", "8GB", "12GB", "16GB"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Screen
                <input
                  value={mobile.screenSize}
                  onChange={(e) =>
                    setMobile({ ...mobile, screenSize: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Battery
              <input
                value={mobile.battery}
                onChange={(e) =>
                  setMobile({ ...mobile, battery: e.target.value })
                }
              />
            </label>
            <label>
              Processor
              <input
                value={mobile.processor}
                onChange={(e) =>
                  setMobile({ ...mobile, processor: e.target.value })
                }
              />
            </label>
            <label>
              Camera
              <input
                value={mobile.camera}
                onChange={(e) =>
                  setMobile({ ...mobile, camera: e.target.value })
                }
              />
            </label>
          </section>
        )}

        {type === "headphone" && (
          <section className="fieldset">
            <h3>Headphone details</h3>
            <div className="form-row-3">
              <label>
                Brand
                <input
                  required
                  value={hp.brand}
                  onChange={(e) => setHp({ ...hp, brand: e.target.value })}
                />
              </label>
              <label>
                Type
                <select
                  value={hp.hpType}
                  onChange={(e) => setHp({ ...hp, hpType: e.target.value })}
                >
                  <option value="Over-Ear">Over-Ear</option>
                  <option value="On-Ear">On-Ear</option>
                  <option value="In-Ear (Earbuds)">In-Ear (Earbuds)</option>
                </select>
              </label>
              <label>
                Connection
                <select
                  value={hp.connectionType}
                  onChange={(e) =>
                    setHp({ ...hp, connectionType: e.target.value })
                  }
                >
                  <option value="Wired">Wired</option>
                  <option value="Wireless">Wireless</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>
            </div>
            <label>
              Battery life (optional)
              <input
                value={hp.batteryLife}
                onChange={(e) =>
                  setHp({ ...hp, batteryLife: e.target.value })
                }
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={hp.hasNoiseCancelling}
                onChange={(e) =>
                  setHp({ ...hp, hasNoiseCancelling: e.target.checked })
                }
              />
              Noise cancelling
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={hp.microphone}
                onChange={(e) =>
                  setHp({ ...hp, microphone: e.target.checked })
                }
              />
              Microphone
            </label>
          </section>
        )}

        <label>
          Product image
          <input name="img" type="file" accept="image/*" required />
        </label>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Publishing…" : "Publish product"}
        </button>
      </form>
    </div>
  );
}
