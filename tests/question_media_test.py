import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('question_media', Path(__file__).resolve().parents[1]/'scripts/render-question-media.py')
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)


class RendererContracts(unittest.TestCase):
    def test_subtitles_keep_hours_and_milliseconds(self):
        self.assertEqual(media.stamp(3661.125), '01:01:01.125')

    def test_public_and_external_outputs_rejected_before_creation(self):
        for p in [media.ROOT/'public/media/test', media.ROOT.parent/'outside']:
            with self.assertRaises(ValueError):
                media.private_path(p, create=True)

    def test_missing_model_answer_and_unsafe_ids_rejected(self):
        for q in [{'id':'valid','prompt':'Question'}, {'id':'../escape','prompt':'Question','answer':'Answer'}]:
            with self.assertRaises(ValueError):
                media.validate_question(q)

    def test_key_feedback_and_model_answer_must_agree(self):
        q = {'id':'stable-id','prompt':'Question','answer':'B','answerIndex':1,'options':[{'text':'A','explanation':'Why not A'},{'text':'B','explanation':'Why B'}]}
        media.validate_question(q)
        for change in [{'answerIndex':2}, {'answerIndex':True}, {'answer':'A'}, {'options':[{'text':'A'},{'text':'B'}]}]:
            with self.assertRaises(ValueError):
                media.validate_question({**q,**change})


if __name__ == '__main__':
    unittest.main()
