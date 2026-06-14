import { useHotkeys } from 'react-hotkeys-hook';

interface DoctorShortcutsProps {
  onEndConsultation: () => void;
  onPrescribe: () => void;
  onCloseModal: () => void;
  onSearchFocus: () => void;
}

export function useDoctorShortcuts({
  onEndConsultation,
  onPrescribe,
  onCloseModal,
  onSearchFocus
}: DoctorShortcutsProps) {
  // 'E' to end consultation
  useHotkeys('e', (e) => {
    e.preventDefault();
    onEndConsultation();
  }, { enableOnFormTags: false });

  // 'P' to open prescribe
  useHotkeys('p', (e) => {
    e.preventDefault();
    onPrescribe();
  }, { enableOnFormTags: false });

  // 'Escape' to close modals
  useHotkeys('esc', () => {
    onCloseModal();
  }, { enableOnFormTags: true }); // Esc should work even when typing in a form

  // 'Cmd+K' / 'Ctrl+K' to focus search
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    onSearchFocus();
  }, { enableOnFormTags: true });
}
