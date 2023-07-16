import { Modal } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { MessageExporter } from "@/app/components/chat/export/index";

export function ExportMessageModal(props: { onClose: () => void }) {
  return (
    <div className="modal-mask">
      <Modal title={Locale.Export.Title} onClose={props.onClose}>
        <div style={{ minHeight: "40vh" }}>
          <MessageExporter />
        </div>
      </Modal>
    </div>
  );
}
