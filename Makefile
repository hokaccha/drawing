PACKPAGE_NAME = drawing

package:
	@zip -r ${PACKPAGE_NAME}.zip src

.PHONY: package
