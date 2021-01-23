import $ from 'jquery';

import config from '../config';

export default ($section, opts, callback) => {
  const $main = $('main');
  const options = {
    noFade: false,
    $targetSection: [],
    ...opts,
  };

  const hasTargetSection = options.$targetSection.length;
  const $targetSection = hasTargetSection
    ? $(options.$targetSection)
    : $main;

  if (options.noFade) {
    if (hasTargetSection) {
      $targetSection.empty().append($section);
    } else {
      $main.empty().append($section);
    }

    if (callback) {
      callback();
    }
  } else if (hasTargetSection) {
    $targetSection.fadeOut(config.sectionFadeTime, () => {
      $targetSection.empty().append($section);
      $targetSection.fadeIn(config.sectionFadeTime, callback ? callback() : null);
    });
  } else {
    $main.fadeOut(config.sectionFadeTime, () => {
      $main
        .empty()
        .append($section)
        .fadeIn(config.sectionFadeTime, callback ? callback() : null);
    });
  }
};
