import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { modelToViewAttributeConverter } from '@ckeditor/ckeditor5-image/src/image/converters';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

class InsertImage extends Plugin {
  init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const conversion = editor.conversion;

    schema.extend('image', {
      allowAttributes: ['data-mathml', 'advanced']
    });

    conversion
      .for('downcast')
      .add(modelToViewAttributeConverter('data-mathml'));
    conversion.for('downcast').add(modelToViewAttributeConverter('advanced'));
    conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'img',
        key: 'advanced'
      },
      model: 'advanced'
    });
    conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'img',
        key: 'data-mathml'
      },
      model: 'data-mathml'
    });

    editor.ui.componentFactory.add('insertImage', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      });

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        const imageUrl = prompt('Image URL');

        editor.model.change(writer => {
          const imageElement = writer.createElement('image', {
            src: imageUrl,
            'data-mathml': 'test',
            advanced: true
          });

          // Insert the image in the current selection location.
          editor.model.insertContent(
            imageElement,
            editor.model.document.selection
          );
        });
      });

      return view;
    });
  }
}

ClassicEditor.create(document.querySelector('#editor'), {
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Image,
    InsertImage,
    ImageCaption
  ],
  toolbar: ['bold', 'italic', 'insertImage']
})
  .then(editor => {
    console.log('Editor was initialized', editor);
  })
  .catch(error => {
    console.error(error.stack);
  });
